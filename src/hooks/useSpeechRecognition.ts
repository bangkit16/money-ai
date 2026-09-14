import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { requireNativeModule } from "expo";

// Native module is only present in a development build — NOT in Expo Go.
// Lazy require so importing this hook never crashes when the module is missing
// (the app should still run; voice just won't work until rebuilt).
let ExpoSpeechRecognitionModule: any = null;
try {
  ExpoSpeechRecognitionModule = requireNativeModule("ExpoSpeechRecognition");
} catch {
  // not available (e.g. Expo Go, or module not linked)
}

type SpeechRecognitionHook = {
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  supported: boolean;
};

/** Debounce: after this much silence following speech, recognition auto-stops
 *  and `onNaturalEnd` fires with the accumulated text. */
const AUTO_SEND_DELAY_MS = 1200;

type UseSpeechRecognitionOptions = {
  /** Called with each (interim or final) transcript as it arrives. */
  onTranscript?: (text: string) => void;
  /** Debounced: fired when recognition ends by itself (silence detected after
   *  speech) with the final text. Not fired on a manual stop(). */
  onNaturalEnd?: (text: string) => void;
};

// ── Web ──────────────────────────────────────────────────────────────────────
function useWebSpeech({
  onTranscript,
  onNaturalEnd,
}: UseSpeechRecognitionOptions): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualStopRef = useRef(false);
  const transcriptRef = useRef("");

  const supported =
    typeof window !== "undefined" &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  useEffect(() => {
    if (!supported) return;
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "id-ID";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalT = "";
      let interimT = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalT += r[0].transcript;
        else interimT += r[0].transcript;
      }
      let next: string;
      if (finalT) {
        next = transcriptRef.current
          ? transcriptRef.current + " " + finalT
          : finalT;
      } else if (interimT) {
        const base = transcriptRef.current.includes("…")
          ? transcriptRef.current.split("…")[0]
          : transcriptRef.current;
        next = base ? base + " " + interimT + "…" : interimT + "…";
      } else {
        return;
      }
      transcriptRef.current = next;
      setTranscript(next);
      onTranscript?.(next);

      // Debounce: reset silence timer on every result; stop after silence.
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        manualStopRef.current = false; // ended by silence → natural end
        recognition.stop();
      }, AUTO_SEND_DELAY_MS);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (!manualStopRef.current && transcriptRef.current.trim()) {
        onNaturalEnd?.(transcriptRef.current.trim());
      }
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [supported, onTranscript, onNaturalEnd]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    transcriptRef.current = "";
    manualStopRef.current = false;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    manualStopRef.current = true;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, start, stop, supported };
}

// ── Native (Android / iOS) via expo-speech-recognition ───────────────────────
function useNativeSpeech({
  onTranscript,
  onNaturalEnd,
}: UseSpeechRecognitionOptions): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualStopRef = useRef(false);
  const transcriptRef = useRef("");

  const supported =
    (Platform.OS === "android" || Platform.OS === "ios") &&
    !!ExpoSpeechRecognitionModule;

  useEffect(() => {
    if (!supported || !ExpoSpeechRecognitionModule) return;

    // expo-speech-recognition proxies expo-core events through this addListener
    const removeResult = ExpoSpeechRecognitionModule.addListener(
      "result",
      (event: any) => {
        const text = event.results[0]?.transcript ?? "";
        if (text) {
          transcriptRef.current = text;
          setTranscript(text);
          onTranscript?.(text);

          // Debounce: reset silence timer on every result; stop after silence.
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            manualStopRef.current = false; // ended by silence → natural end
            try {
              ExpoSpeechRecognitionModule?.stop();
            } catch {
              /* noop */
            }
          }, AUTO_SEND_DELAY_MS);
        }
      },
    );
    const removeStart = ExpoSpeechRecognitionModule.addListener("start", () => {
      setIsListening(true);
    });
    const removeEnd = ExpoSpeechRecognitionModule.addListener("end", () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (!manualStopRef.current && transcriptRef.current.trim()) {
        onNaturalEnd?.(transcriptRef.current.trim());
      }
    });
    const removeError = ExpoSpeechRecognitionModule.addListener("error", () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    });

    return () => {
      removeResult.remove();
      removeStart.remove();
      removeEnd.remove();
      removeError.remove();
    };
  }, [supported, onTranscript, onNaturalEnd]);

  const start = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) return;
    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    setTranscript("");
    transcriptRef.current = "";
    manualStopRef.current = false;
    setIsListening(true);
    ExpoSpeechRecognitionModule.start({
      lang: "id-ID",
      interimResults: true,
      continuous: true,
    });
  }, []);

  const stop = useCallback(() => {
    manualStopRef.current = true;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    try {
      ExpoSpeechRecognitionModule?.stop();
    } catch {
      /* noop */
    }
    setIsListening(false);
  }, []);

  return { isListening, transcript, start, stop, supported };
}

// ── Selector ─────────────────────────────────────────────────────────────────
export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {},
): SpeechRecognitionHook {
  const web = useWebSpeech(options);
  const native = useNativeSpeech(options);
  return Platform.OS === "web" ? web : native;
}