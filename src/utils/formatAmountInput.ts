/**
 * Format a raw numeric string with thousand separators (dot).
 * Example: "5000" → "5.000", "1234567" → "1.234.567"
 */
export function formatAmountInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Unformat a formatted string back to raw digits.
 * Example: "5.000" → "5000", "1.234.567" → "1234567"
 */
export function unformatAmountInput(formatted: string): string {
  return formatted.replace(/\./g, "");
}
