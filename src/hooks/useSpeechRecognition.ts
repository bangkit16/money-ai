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

type UseSpeechRecognitionOptions = {
  /** Called with each (interim or final) transcript as it arrives. */
  onTranscript?: (text: string) => void;
};

// ── Web ──────────────────────────────────────────────────────────────────────
function useWebSpeech({ onTranscript }: UseSpeechRecognitionOptions): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (finalT) {
        setTranscript((p) => {
          const next = p ? p + " " + finalT : finalT;
          onTranscript?.(next);
          return next;
        });
      } else if (interimT) {
        setTranscript((p) => {
          const base = p.includes("…") ? p.split("…")[0] : p;
          const next = base ? base + " " + interimT + "…" : interimT + "…";
          onTranscript?.(next);
          return next;
        });
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => recognition.stop(), 1000);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [supported, onTranscript]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript("");
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, start, stop, supported };
}

// ── Native (Android / iOS) via expo-speech-recognition ───────────────────────
function useNativeSpeech({ onTranscript }: UseSpeechRecognitionOptions): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          setTranscript(text);
          onTranscript?.(text);
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
  }, [supported, onTranscript]);

  const start = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) return;
    const permission =
      await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) return;
    setTranscript("");
    setIsListening(true);
    ExpoSpeechRecognitionModule.start({
      lang: "id-ID",
      interimResults: true,
      continuous: true,
    });
  }, []);

  const stop = useCallback(() => {
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
