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

export type LanguageCode = "id" | "en";
export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
];

const CURRENCY_STORAGE_KEY = "app.currency";
const LANGUAGE_STORAGE_KEY = "app.language";
const DEFAULT_CURRENCY: CurrencyCode = "IDR";
const DEFAULT_LANGUAGE: LanguageCode = "id";

type SettingsContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      AsyncStorage.getItem(CURRENCY_STORAGE_KEY),
      AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
    ])
      .then(([savedCurrency, savedLanguage]) => {
        if (cancelled) return;
        if (savedCurrency && CURRENCIES.some((c) => c.code === savedCurrency)) {
          setCurrencyState(savedCurrency as CurrencyCode);
        }
        if (savedLanguage && LANGUAGES.some((l) => l.code === savedLanguage)) {
          setLanguageState(savedLanguage as LanguageCode);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    Promise.resolve(AsyncStorage.setItem(CURRENCY_STORAGE_KEY, c)).catch(() => {});
  }, []);

  const setLanguage = useCallback((l: LanguageCode) => {
    setLanguageState(l);
    Promise.resolve(AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, l)).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency, language, setLanguage }),
    [currency, setCurrency, language, setLanguage]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
