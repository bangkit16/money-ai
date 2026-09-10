import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

type SpeechRecognitionHook = {
  isListening: boolean;
  transcript: string;
  start: () => void;
  stop: () => void;
  supported: boolean;
};

// ── Web ──────────────────────────────────────────────────────────────────────
function useWebSpeech(): SpeechRecognitionHook {
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
        setTranscript((p) => (p ? p + " " + finalT : finalT));
      } else if (interimT) {
        setTranscript((p) => {
          const base = p.includes("…") ? p.split("…")[0] : p;
          return base ? base + " " + interimT + "…" : interimT + "…";
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
  }, [supported]);

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

// ── Native (Android / iOS) via @react-native-voice/voice ─────────────────────
function useNativeSpeech(): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lazy require so web bundle doesn't choke on native-only module
  const VoiceRef = useRef<typeof import("@react-native-voice/voice").default | null>(null);

  const getVoice = useCallback(async () => {
    if (VoiceRef.current) return VoiceRef.current;
    try {
      const mod = await import("@react-native-voice/voice");
      VoiceRef.current = mod.default;
      return mod.default;
    } catch {
      return null;
    }
  }, []);

  const supported = Platform.OS === "android" || Platform.OS === "ios";

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;

    (async () => {
      const Voice = await getVoice();
      if (!Voice || cancelled) return;

      Voice.onSpeechStart = () => {};
      Voice.onSpeechEnd = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };
      Voice.onSpeechError = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };
      Voice.onSpeechResults = (e: { value?: string[] }) => {
        const text = e.value?.[0] ?? "";
        if (text) setTranscript(text);
        // Auto-stop after 1s silence
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          Voice.stop().catch(() => {});
        }, 1000);
      };
      Voice.onSpeechError = () => setIsListening(false);
    })();

    return () => {
      cancelled = true;
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [supported, getVoice]);

  const start = useCallback(async () => {
    const Voice = await getVoice();
    if (!Voice) return;
    setTranscript("");
    setIsListening(true);
    try {
      await Voice.start("id-ID");
    } catch {
      setIsListening(false);
    }
  }, [getVoice]);

  const stop = useCallback(async () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    const Voice = await getVoice();
    if (!Voice) return;
    try {
      await Voice.stop();
    } catch {
      /* noop */
    }
    setIsListening(false);
  }, [getVoice]);

  return { isListening, transcript, start, stop, supported };
}

// ── Selector ─────────────────────────────────────────────────────────────────
export function useSpeechRecognition(): SpeechRecognitionHook {
  const web = useWebSpeech();
  const native = useNativeSpeech();
  return Platform.OS === "web" ? web : native;
}
