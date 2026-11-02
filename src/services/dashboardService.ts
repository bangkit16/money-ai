import { transactions$, type TransactionEntity } from "@/store/transactions$";
import { accounts$ } from "@/store/accounts$";
import { categories$ } from "@/store/categories$";
import { supabase } from "@/lib/supabase";
import type { TransactionType } from "@/services/addTransactionService";
import type { LanguageCode } from "@/providers/settings-provider";

export type DashboardSummary = {
  netWorth: number;
  trendPct: number;
  prevMonthNet: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  incomeBarWidth: number;
  expenseBarWidth: number;
  monthLabel: string;
};

export type DashboardTxRow = {
  amount: number;
  transaction_type: TransactionType;
  created_at: string;
  account: { id: number; account_name: string; exclude_from_total?: boolean } | null;
  to_account: { id: number; account_name: string; exclude_from_total?: boolean } | null;
};

export type RecentTxRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category: { id: number; category: string; category_en: string | null; slug: string; icon: string } | null;
  from_account: { id: number; account_name: string } | null;
  to_account: { id: number; account_name: string } | null;
};

export class DashboardService {
  // ponytail: komputasi summary sinkron dari Legend-State observables
  static computeSummary(
    allTx: DashboardTxRow[],
    totalBalance: number,
    language: LanguageCode = "id"
  ): DashboardSummary {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    let prevMonthIncome = 0;
    let prevMonthExpense = 0;

    for (const tx of allTx) {
      if (tx.account?.exclude_from_total) continue;

      const isIncome = tx.transaction_type === "INCOME";
      const txDate = new Date(tx.created_at);

      if (txDate >= monthStart) {
        if (isIncome) thisMonthIncome += tx.amount;
        else if (tx.transaction_type === "EXPENSE") thisMonthExpense += tx.amount;
      } else if (txDate >= prevMonthStart && txDate < monthStart) {
        if (isIncome) prevMonthIncome += tx.amount;
        else if (tx.transaction_type === "EXPENSE") prevMonthExpense += tx.amount;
      }
    }

    const thisMonthNet = thisMonthIncome - thisMonthExpense;
    const prevMonthNet = prevMonthIncome - prevMonthExpense;
    const trendPct =
      prevMonthNet !== 0
        ? ((thisMonthNet - prevMonthNet) / Math.abs(prevMonthNet)) * 100
        : thisMonthNet !== 0
          ? 100
          : 0;

    const flowTotal = thisMonthIncome + thisMonthExpense;
    const incomeBarWidth = flowTotal > 0 ? (thisMonthIncome / flowTotal) * 100 : 0;
    const expenseBarWidth = flowTotal > 0 ? (thisMonthExpense / flowTotal) * 100 : 0;
    const monthLabel = now.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      netWorth: totalBalance,
      trendPct,
      prevMonthNet,
      thisMonthIncome,
      thisMonthExpense,
      incomeBarWidth,
      expenseBarWidth,
      monthLabel,
    };
  }

  static async GetTransactions(): Promise<DashboardTxRow[]> {
    const rawTxs = transactions$.peek() ?? {};
    const rawAccs = accounts$.peek() ?? {};

    return Object.values(rawTxs).map((tx) => ({
      amount: tx.amount,
      transaction_type: tx.transaction_type,
      created_at: tx.transaction_date || tx.created_at,
      account:
        tx.account_id && rawAccs[tx.account_id]
          ? {
              id: tx.account_id,
              account_name: rawAccs[tx.account_id].account_name,
              exclude_from_total: rawAccs[tx.account_id].exclude_from_total,
            }
          : null,
      to_account:
        tx.to_account_id && rawAccs[tx.to_account_id]
          ? {
              id: tx.to_account_id,
              account_name: rawAccs[tx.to_account_id].account_name,
              exclude_from_total: rawAccs[tx.to_account_id].exclude_from_total,
            }
          : null,
    }));
  }

  static async GetRecentTransactions(limit = 3): Promise<RecentTxRow[]> {
    const rawTxs = transactions$.peek() ?? {};
    const rawCats = categories$.peek() ?? {};
    const rawAccs = accounts$.peek() ?? {};

    const list = Object.values(rawTxs);
    list.sort((a, b) => {
      const da = new Date(a.transaction_date || a.created_at).getTime();
      const db = new Date(b.transaction_date || b.created_at).getTime();
      return db - da;
    });

    return list.slice(0, limit).map((tx) => {
      const cat = tx.category_id ? rawCats[tx.category_id] : null;
      const fromAcc = tx.account_id ? rawAccs[tx.account_id] : null;
      const toAcc = tx.to_account_id ? rawAccs[tx.to_account_id] : null;

      return {
        id: tx.id,
        created_at: tx.transaction_date || tx.created_at,
        transaction: tx.transaction,
        amount: tx.amount,
        transaction_type: tx.transaction_type,
        category: cat
          ? {
              id: cat.id,
              category: cat.category,
              category_en: cat.category_en,
              slug: cat.slug,
              icon: cat.icon,
            }
          : null,
        from_account: fromAcc
          ? { id: fromAcc.id, account_name: fromAcc.account_name }
          : null,
        to_account: toAcc
          ? { id: toAcc.id, account_name: toAcc.account_name }
          : null,
      };
    });
  }

  static async GetRemoteSummary() {
    const { data, error } = await supabase.rpc("get_dashboard_summary");
    if (error) throw error;
    return data;
  }
}
