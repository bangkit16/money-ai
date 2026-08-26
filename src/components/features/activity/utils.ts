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

type TxType = "INCOME" | "EXPENSE";

export function getIcon(category: TransactionRow["category"], type: TxType) {
  if (category?.slug && ICON_BY_SLUG[category.slug])
    return ICON_BY_SLUG[category.slug];
  return type === "INCOME" ? "payments" : "receipt-long";
}

export function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

// Kelompokkan array transaksi (sudah terurut created_at desc) jadi section per tanggal
export function groupByDate(transactions: TransactionRow[]) {
  const sections: { title: string; data: TransactionRow[] }[] = [];

  for (const tx of transactions) {
    const label = getDateLabel(tx.created_at);
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.title === label) {
      lastSection.data.push(tx);
    } else {
      sections.push({ title: label, data: [tx] });
    }
  }

  return sections;
}
