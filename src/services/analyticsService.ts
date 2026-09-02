import { supabase } from "@/lib/supabase";

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
  percent: number;
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

// Color palette fallback (urut konsisten dengan legend chart) — green brand
const PALETTE = [
  "#0a2505", // primary deep
  "#1b4d1b", // forest
  "#3FA796", // teal
  "#6b8e4e", // sage
  "#a8b88f", // light sage
  "#d4e3c4", // pale sage
];

function monthLabel(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function startEndOfMonth(d: Date) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();
  return { start, end };
}

export class AnalyticsService {
  static readonly keys = {
    current: ["analytics-current-month"] as const,
  };

  /**
   * Ambil agregat spending untuk bulan berjalan, dikelompok per kategori.
   * Hanya transaksi EXPENSE (exclude TRANSFER & INCOME).
   * Filter user_id via RLS otomatis karena pakai supabase.auth.getUser().
   */
  static async GetCurrentMonth() {
    const now = new Date();
    const { start, end } = startEndOfMonth(now);

    const { data, error } = await supabase
      .from("transaction")
      .select(
        "amount, category:category_transaction(id, category, icon)",
      )
      .eq("transaction_type", "EXPENSE")
      .gte("transaction_date", start)
      .lt("transaction_date", end);

    if (error) throw new Error(error.message);

    type Row = {
      amount: number;
      category: { id: number; category: string; icon: string } | null;
    };
    const rows = (data ?? []) as unknown as Row[];

    // Group by category
    const byCat = new Map<number, CategorySummary>();
    let total = 0;
    for (const r of rows) {
      const amt = Number(r.amount) || 0;
      total += amt;
      if (!r.category) continue;
      const cur = byCat.get(r.category.id);
      if (cur) {
        cur.total += amt;
      } else {
        byCat.set(r.category.id, {
          id: r.category.id,
          name: r.category.category,
          icon: r.category.icon,
          total: amt,
        });
      }
    }

    const sorted = [...byCat.values()].sort((a, b) => b.total - a.total);

    const segments: AnalyticsSegment[] = sorted.slice(0, 4).map((c, i) => ({
      id: c.id,
      label: `${c.name} (${total > 0 ? Math.round((c.total / total) * 100) : 0}%)`,
      percent: total > 0 ? (c.total / total) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    }));

    // Sisanya digabung jadi "Other" kalau ada lebih dari 4 kategori
    if (sorted.length > 4) {
      const otherTotal = sorted.slice(4).reduce((s, c) => s + c.total, 0);
      segments.push({
        id: -1,
        label: `Other (${total > 0 ? Math.round((otherTotal / total) * 100) : 0}%)`,
        percent: total > 0 ? (otherTotal / total) * 100 : 0,
        color: PALETTE[4 % PALETTE.length],
      });
    }

    const topCategories: TopCategory[] = sorted.slice(0, 5).map((c, i) => ({
      icon: c.icon || "more-horiz",
      name: c.name,
      subtitle: "Monthly total",
      amount: c.total,
      percent: total > 0 ? Math.min(100, (c.total / total) * 100) : 0,
      color: PALETTE[i % PALETTE.length],
    }));

    return {
      monthLabel: `Insights for ${monthLabel(now)}`,
      totalSpend: total,
      segments,
      topCategories,
    } satisfies AnalyticsData;
  }
}