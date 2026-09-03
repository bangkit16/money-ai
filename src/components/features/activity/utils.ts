import type { ActivityTransactionRow } from "@/services/activityService";
import type { LanguageCode } from "@/providers/settings-provider";

export type TransactionRow = ActivityTransactionRow;

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

export type Translator = (key: string) => string;

export function getDisplayTitle(
  row: TransactionRow,
  t: Translator
): string {
  if (row.transaction && row.transaction.trim()) return row.transaction;
  if (row.category?.category) return row.category.category;
  if (row.transaction_type === "TRANSFER") {
    const from = row.from_account?.account_name;
    const to = row.to_account?.account_name;
    if (from && to) return `${from} → ${to}`;
    if (to) return `→ ${to}`;
    if (from) return `${from} →`;
  }
  if (row.transaction_type === "INCOME") return t("activity.fallbackIncome");
  if (row.transaction_type === "EXPENSE") return t("activity.fallbackExpense");
  return t("activity.fallbackTransaction");
}

export function getDisplaySubtitle(row: TransactionRow): string {
  if (row.transaction_type === "TRANSFER") return "";
  if (row.category?.category) return row.category.category;
  return "";
}

export function formatTime(dateStr: string, lang: LanguageCode) {
  return new Date(dateStr).toLocaleTimeString(lang === "id" ? "id-ID" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export type DateLabel =
  | { kind: "relative"; text: string; dateText: string }
  | { kind: "absolute"; text: string };

function formatDate(date: Date, lang: LanguageCode) {
  return date.toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
    month: "long",
    day: "numeric",
  });
}

export function getDateLabel(
  dateStr: string,
  t: Translator,
  lang: LanguageCode
): DateLabel {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today))
    return { kind: "relative", text: t("activity.today"), dateText: formatDate(date, lang) };
  if (isSameDay(date, yesterday))
    return {
      kind: "relative",
      text: t("activity.yesterday"),
      dateText: formatDate(date, lang),
    };
  return { kind: "absolute", text: formatDate(date, lang) };
}

export function groupByDate(
  transactions: TransactionRow[],
  t: Translator,
  lang: LanguageCode
) {
  const sections: { title: string; label: DateLabel; data: TransactionRow[]; total: number }[] = [];

  for (const tx of transactions) {
    const label = getDateLabel(tx.created_at, t, lang);
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
