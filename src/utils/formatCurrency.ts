/**
 * Format a numeric value as Indonesian rupiah (Rp).
 *
 * @param value - The numeric amount to format
 * @param type - Optional 'INCOME' | 'EXPENSE' to add sign prefix (+/-)
 * @returns Formatted string like "Rp 1.234,56" or "-Rp 1.234,56"
 */
export function formatCurrency(value: number, type?: 'INCOME' | 'EXPENSE'): string {
  const sign = type === 'EXPENSE' ? '-' : type === 'INCOME' ? '+' : '';
  return `${sign}Rp${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

/**
 * Short format for display - just Rp with thousands separator
 *
 * @param value - The numeric amount to format
 * @returns Formatted string like "Rp 1.234"
 */
export function formatCurrencyShort(value: number): string {
  return `Rp${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}