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
const AI_USE_PRIMARY_ACCOUNT_KEY = "app.ai.usePrimaryAccount";
const AI_AUTO_SAVE_KEY = "app.ai.autoSaveTransaction";
const DEFAULT_CURRENCY: CurrencyCode = "IDR";
const DEFAULT_LANGUAGE: LanguageCode = "id";

type SettingsContextValue = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  usePrimaryAccount: boolean;
  setUsePrimaryAccount: (v: boolean) => void;
  autoSaveTransaction: boolean;
  setAutoSaveTransaction: (v: boolean) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [usePrimaryAccount, setUsePrimaryAccountState] = useState(false);
  const [autoSaveTransaction, setAutoSaveTransactionState] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      AsyncStorage.getItem(CURRENCY_STORAGE_KEY),
      AsyncStorage.getItem(LANGUAGE_STORAGE_KEY),
      AsyncStorage.getItem(AI_USE_PRIMARY_ACCOUNT_KEY),
      AsyncStorage.getItem(AI_AUTO_SAVE_KEY),
    ])
      .then(([savedCurrency, savedLanguage, savedUsePrimary, savedAutoSave]) => {
        if (cancelled) return;
        if (savedCurrency && CURRENCIES.some((c) => c.code === savedCurrency)) {
          setCurrencyState(savedCurrency as CurrencyCode);
        }
        if (savedLanguage && LANGUAGES.some((l) => l.code === savedLanguage)) {
          setLanguageState(savedLanguage as LanguageCode);
        }
        if (savedUsePrimary === "true") setUsePrimaryAccountState(true);
        if (savedAutoSave === "true") setAutoSaveTransactionState(true);
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

  const setUsePrimaryAccount = useCallback((v: boolean) => {
    setUsePrimaryAccountState(v);
    Promise.resolve(AsyncStorage.setItem(AI_USE_PRIMARY_ACCOUNT_KEY, String(v))).catch(() => {});
  }, []);

  const setAutoSaveTransaction = useCallback((v: boolean) => {
    setAutoSaveTransactionState(v);
    Promise.resolve(AsyncStorage.setItem(AI_AUTO_SAVE_KEY, String(v))).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      currency, setCurrency,
      language, setLanguage,
      usePrimaryAccount, setUsePrimaryAccount,
      autoSaveTransaction, setAutoSaveTransaction,
    }),
    [currency, setCurrency, language, setLanguage, usePrimaryAccount, setUsePrimaryAccount, autoSaveTransaction, setAutoSaveTransaction]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
