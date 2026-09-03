import type { ActivityTransactionRow } from "@/services/activityService";

export type TransactionRow = ActivityTransactionRow;

// DB belum punya kolom icon per kategori, jadi kita map manual dari slug.
// TODO: sesuaikan key-nya dengan slug asli di tabel category_transaction kamu.
const ICON_BY_SLUG: Record<string, string> = {
  food: "restaurant",
  shopping: "shopping-bag",
  bills: "receipt",
  travel: "flight",
  transport: "directions-car",
  auto: "directions-car",
  health: "medical-services",
  fun: "movie",
  entertainment: "movie",
  housing: "house",
  salary: "payments",
  others: "more-horiz",
};

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

export function getIcon(category: TransactionRow["category"], type: TxType) {
  if (type === "TRANSFER") return "swap-horiz";
  if (category?.slug && ICON_BY_SLUG[category.slug])
    return ICON_BY_SLUG[category.slug];
  return type === "INCOME" ? "payments" : "receipt-long";
}

// Title fallback: transaction > category > "Pemasukan"/"Pengeluaran"/dari akun tujuan
export function getDisplayTitle(row: TransactionRow): string {
  if (row.transaction && row.transaction.trim()) return row.transaction;
  if (row.category?.category) return row.category.category;
  if (row.transaction_type === "TRANSFER") {
    const from = row.from_account?.account_name;
    const to = row.to_account?.account_name;
    if (from && to) return `${from} → ${to}`;
    if (to) return `→ ${to}`;
    if (from) return `${from} →`;
  }
  if (row.transaction_type === "INCOME") return "Pemasukan";
  if (row.transaction_type === "EXPENSE") return "Pengeluaran";
  return "Transaksi";
}

// Subtitle: kalau TRANSFER, return "" — baris akun eksplisit sudah cukup.
// Kalau bukan TRANSFER & ada category, tampilkan category.
// Kalau kosong semua, tampilkan nothing (return "").
export function getDisplaySubtitle(row: TransactionRow): string {
  if (row.transaction_type === "TRANSFER") return "";
  if (row.category?.category) return row.category.category;
  return "";
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export type DateLabel =
  | { kind: "relative"; text: "Today" | "Yesterday"; dateText: string }
  | { kind: "absolute"; text: string };

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getDateLabel(dateStr: string): DateLabel {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today))
    return { kind: "relative", text: "Today", dateText: formatDate(date) };
  if (isSameDay(date, yesterday))
    return {
      kind: "relative",
      text: "Yesterday",
      dateText: formatDate(date),
    };
  return { kind: "absolute", text: formatDate(date) };
}

// Kelompokkan array transaksi (sudah terurut created_at desc) jadi section per tanggal
export function groupByDate(transactions: TransactionRow[]) {
  const sections: { title: string; label: DateLabel; data: TransactionRow[]; total: number }[] = [];

  for (const tx of transactions) {
    const label = getDateLabel(tx.created_at);
    const title = label.text;
    const lastSection = sections[sections.length - 1];
    const amount = Number(tx.amount) || 0;
    const signed = tx.transaction_type === "EXPENSE" ? -amount : amount;
    if (lastSection && lastSection.title === title) {
      lastSection.data.push(tx);
      lastSection.total += signed;
    } else {
      sections.push({ title, label, data: [tx], total: signed });
    }
  }

  return sections;
}
