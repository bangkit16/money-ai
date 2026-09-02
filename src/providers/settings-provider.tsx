import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CurrencyCode = "IDR" | "USD" | "EUR" | "JPY" | "SGD" | "MYR";

export const CURRENCIES: { code: CurrencyCode; symbol: string; locale: string }[] = [
  { code: "IDR", symbol: "Rp", locale: "id-ID" },
  { code: "USD", symbol: "$", locale: "en-US" },
  { code: "EUR", symbol: "€", locale: "de-DE" },
  { code: "JPY", symbol: "¥", locale: "ja-JP" },
  { code: "SGD", symbol: "S$", locale: "en-SG" },
  { code: "MYR", symbol: "RM", locale: "ms-MY" },
];

const STORAGE_KEY = "app.currency";
const DEFAULT: CurrencyCode = "IDR";

type SettingsContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(AsyncStorage.getItem(STORAGE_KEY))
      .then((saved) => {
        if (cancelled) return;
        if (saved && CURRENCIES.some((c) => c.code === saved)) {
          setCurrencyState(saved as CurrencyCode);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    Promise.resolve(AsyncStorage.setItem(STORAGE_KEY, c)).catch(() => {});
  }, []);

  const value = useMemo(() => ({ currency, setCurrency }), [currency, setCurrency]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
