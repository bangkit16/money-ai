import { transactions$ } from "@/store/transactions$";
import { categories$ } from "@/store/categories$";
import type { LanguageCode } from "@/providers/settings-provider";
import { tFor } from "@/i18n";

export type CategorySummary = {
  id: number;
  name: string;
  icon: string;
  total: number;
};

export type AnalyticsData = {
  monthLabel: string;
  totalSpend: number;
  segments: AnalyticsSegment[];
  topCategories: TopCategory[];
};

export type AnalyticsSegment = {
  id: number;
  label: string;
  value: number;
  color: string;
};

export type TopCategory = {
  icon: string;
  name: string;
  subtitle: string;
  amount: number;
  percent: number;
  color: string;
};

const PALETTE = [
  "#0b3d03", // primary deep
  "#1b4d1b", // forest
  "#3FA796", // teal
  "#6b8e4e", // sage
  "#a8b88f", // light sage
  "#d4e3c4", // pale sage
];

function monthLabel(d: Date, lang: LanguageCode) {
  const locale = lang === "id" ? "id-ID" : "en-US";
  return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

function startEndOfMonth(d: Date) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
  return { start, end };
}

export type AnalyticsType = "EXPENSE" | "INCOME";

export class AnalyticsService {
  static ComputeCurrentMonth(
    lang: LanguageCode = "id",
    type: AnalyticsType = "EXPENSE"
  ): AnalyticsData {
    const now = new Date();
    const { start, end } = startEndOfMonth(now);

    const rawTxs = transactions$.get() ?? {};
    const rawCats = categories$.get() ?? {};

    const rows = Object.values(rawTxs).filter((tx) => {
      if (tx.transaction_type !== type) return false;
      const txTime = new Date(tx.transaction_date || tx.created_at).getTime();
      return txTime >= start && txTime < end;
    });

    const byCat = new Map<number, CategorySummary>();
    let total = 0;

    for (const r of rows) {
      const amt = Number(r.amount) || 0;
      total += amt;
      const cat = r.category_id ? rawCats[r.category_id] : null;
      if (!cat) continue;

      const cur = byCat.get(cat.id);
      if (cur) {
        cur.total += amt;
      } else {
        byCat.set(cat.id, {
          id: cat.id,
          name: lang === "en" && cat.category_en ? cat.category_en : cat.category,
          icon: cat.icon,
          total: amt,
        });
      }
    }

    const sorted = [...byCat.values()].sort((a, b) => b.total - a.total);

    const segments: AnalyticsSegment[] = sorted.slice(0, 4).map((c, i) => ({
      id: c.id,
      label: `${c.name} (${total > 0 ? Math.round((c.total / total) * 100) : 0}%)`,
      value: total > 0 ? (c.total / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }));

    if (sorted.length > 4) {
      const otherTotal = sorted.slice(4).reduce((s, c) => s + c.total, 0);
      segments.push({
        id: -1,
        label: `Other (${total > 0 ? Math.round((otherTotal / total) * 100) : 0}%)`,
        value: total > 0 ? (otherTotal / total) * 100 : 0,
        color: PALETTE[4 % PALETTE.length],
      });
    }

    const topCategories: TopCategory[] = sorted.slice(0, 5).map((c, i) => ({
      icon: c.icon || "more-horiz",
      name: c.name,
      subtitle: tFor(lang, "analytics.monthlyTotal"),
      amount: c.total,
      percent: total > 0 ? Math.min(100, (c.total / total) * 100) : 0,
      color: PALETTE[i % PALETTE.length],
    }));

    return {
      monthLabel: tFor(lang, "analytics.insightsFor", { month: monthLabel(now, lang) }),
      totalSpend: total,
      segments,
      topCategories,
    };
  }

  static async GetCurrentMonth(
    lang: LanguageCode = "id",
    type: AnalyticsType = "EXPENSE"
  ): Promise<AnalyticsData> {
    return this.ComputeCurrentMonth(lang, type);
  }
}
