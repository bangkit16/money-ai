import { transactions$ } from "@/store/transactions$";
import { accounts$ } from "@/store/accounts$";
import { categories$ } from "@/store/categories$";
import type { TransactionType } from "@/services/addTransactionService";

export type DashboardTxRow = {
  amount: number;
  transaction_type: TransactionType;
  created_at: string;
  account: { id: number; account_name: string } | null;
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
  static async GetTransactions(): Promise<DashboardTxRow[]> {
    const rawTxs = transactions$.peek() ?? {};
    const rawAccs = accounts$.peek() ?? {};

    return Object.values(rawTxs).map((tx) => ({
      amount: tx.amount,
      transaction_type: tx.transaction_type,
      created_at: tx.transaction_date || tx.created_at,
      account:
        tx.account_id && rawAccs[tx.account_id]
          ? { id: tx.account_id, account_name: rawAccs[tx.account_id].account_name }
          : null,
    }));
  }

  static async GetRecentTransactions(): Promise<RecentTxRow[]> {
    const rawTxs = transactions$.peek() ?? {};
    const rawCats = categories$.peek() ?? {};
    const rawAccs = accounts$.peek() ?? {};

    const list = Object.values(rawTxs);
    list.sort((a, b) => {
      const da = new Date(a.transaction_date || a.created_at).getTime();
      const db = new Date(b.transaction_date || b.created_at).getTime();
      return db - da;
    });

    return list.slice(0, 3).map((tx) => {
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
}
