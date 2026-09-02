import {
  formatCurrency as fmt,
  formatCurrencyShort as fmtShort,
  formatCurrencySigned as fmtSigned,
} from "@/utils/formatCurrency";
import { useSettings } from "@/providers/settings-provider";

export function useFormatCurrency() {
  const { currency } = useSettings();
  return {
    formatCurrency: (v: number, type?: "INCOME" | "EXPENSE") => fmt(v, type, currency),
    formatCurrencyShort: (v: number) => fmtShort(v, currency),
    formatCurrencySigned: (v: number) => fmtSigned(v, currency),
  };
}
