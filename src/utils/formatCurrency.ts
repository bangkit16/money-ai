import { CURRENCIES, type CurrencyCode } from "@/providers/settings-provider";

const getMeta = (code: CurrencyCode) =>
  CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

const format = (value: number, code: CurrencyCode) => {
  const { locale } = getMeta(code);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));
};

/** Format a numeric value as a currency string, e.g. "Rp 1.234,56" or "$1,234.56". */
export function formatCurrency(
  value: number,
  type?: "INCOME" | "EXPENSE",
  currency: CurrencyCode = "IDR",
): string {
  const sign = type === "EXPENSE" ? "-" : type === "INCOME" ? "+" : "";
  const { symbol } = getMeta(currency);
  // IDR convention: symbol prefix with no space, others use locale default
  return currency === "IDR"
    ? `${sign}${symbol}${format(value, currency)}`
    : `${sign}${new Intl.NumberFormat(getMeta(currency).locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(Math.abs(value))}`;
}

/** Same but keeps the sign from the input value. */
export function formatCurrencySigned(value: number, currency: CurrencyCode = "IDR") {
  const sign = value < 0 ? "-" : "";
  const { symbol } = getMeta(currency);
  return currency === "IDR"
    ? `${sign}${symbol}${format(value, currency)}`
    : `${sign}${new Intl.NumberFormat(getMeta(currency).locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
      }).format(Math.abs(value))}`;
}

/** Short form for compact display, no decimals. */
export function formatCurrencyShort(value: number, currency: CurrencyCode = "IDR") {
  const { symbol, locale } = getMeta(currency);
  if (currency === "IDR") {
    return `${symbol}${value.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
