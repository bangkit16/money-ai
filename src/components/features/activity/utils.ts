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
  housing: "home",
  salary: "payments",
  others: "more-horiz",
  drinks: "local-cafe",
  fuel: "local-gas-station",
  parking: "local-parking",
  electric: "bolt",
  water: "water-drop",
  medicine: "medication",
  sports: "fitness-center",
  movies: "theaters",
  gaming: "sports-esports",
  concert: "music-note",
  education: "school",
  books: "menu-book",
  course: "workspace-premium",
  beauty: "spa",
  haircut: "content-cut",
  rent: "apartment",
  repair: "build",
  cleaning: "cleaning-services",
  subscription: "autorenew",
  donation: "volunteer-activism",
  insurance: "security",
  tax: "account-balance",
  childcare: "child-care",
  pet: "pets",
  snacks: "cookie",
  "street-food": "storefront",
  coffee: "coffee",
  cigarette: "smoking-rooms",
  maintenance: "build",
  "car-wash": "local-car-wash",
  toll: "toll",
  train: "train",
  bus: "directions-bus",
  "flight-cat": "flight",
  ship: "directions-boat",
  hotel: "hotel",
  tour: "tour",
  printing: "print",
  business: "store",
  freelance: "work",
  investment: "trending-up",
  dividend: "account-balance",
  interest: "savings",
  bonus: "stars",
  "holiday-bonus": "celebration",
  sales: "sell",
  resale: "redo",
  transfer: "swap-horiz",
};

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

export function getIcon(category: TransactionRow["category"], type: TxType) {
  if (type === "TRANSFER") return "swap-horiz";
  if (category?.slug && ICON_BY_SLUG[category.slug])
    return ICON_BY_SLUG[category.slug];
  return type === "INCOME" ? "payments" : "receipt-long";
}

export type Translator = (key: string) => string;

function getCategoryDisplayName(
  cat: { category: string; category_en: string | null } | null,
  lang: LanguageCode
): string {
  if (!cat) return "";
  return lang === "en" && cat.category_en ? cat.category_en : cat.category;
}

export function getDisplayTitle(
  row: TransactionRow,
  t: Translator,
  lang: LanguageCode = "id"
): string {
  if (row.transaction && row.transaction.trim()) return row.transaction;
  if (row.category?.category) return getCategoryDisplayName(row.category, lang);
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

export function getDisplaySubtitle(row: TransactionRow, lang: LanguageCode = "id"): string {
  if (row.transaction_type === "TRANSFER") return "";
  return getCategoryDisplayName(row.category ?? null, lang);
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
