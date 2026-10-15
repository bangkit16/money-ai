import { transactions$, type TransactionType } from "@/store/transactions$";
import { categories$ } from "@/store/categories$";
import { accounts$ } from "@/store/accounts$";

export type ActivityTransactionRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category: { id: number; category: string; category_en: string | null; slug: string; icon: string } | null;
  from_account: { id: number; account_name: string; exclude_from_total?: boolean } | null;
  to_account: { id: number; account_name: string; exclude_from_total?: boolean } | null;
};

export class ActivityService {
  static async GetTransactions(
    page = 0,
    limit = 10,
    filter: "all" | TransactionType = "all",
    search = "",
    accountId?: number | null
  ): Promise<ActivityTransactionRow[]> {
    const rawTxs = transactions$.peek() ?? {};
    const rawCats = categories$.peek() ?? {};
    const rawAccs = accounts$.peek() ?? {};

    let list = Object.values(rawTxs);

    if (filter !== "all") {
      list = list.filter((tx) => tx.transaction_type === filter);
    }

    if (accountId !== undefined && accountId !== null) {
      const targetId = Number(accountId);
      list = list.filter(
        (tx) =>
          (tx.account_id != null && Number(tx.account_id) === targetId) ||
          (tx.to_account_id != null && Number(tx.to_account_id) === targetId)
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((tx) => (tx.transaction ?? "").toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      const da = new Date(a.transaction_date || a.created_at).getTime();
      const db = new Date(b.transaction_date || b.created_at).getTime();
      return db - da;
    });

    const offset = page * limit;
    const paginated = list.slice(offset, offset + limit);

    return paginated.map((tx) => {
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
          ? {
              id: fromAcc.id,
              account_name: fromAcc.account_name,
              exclude_from_total: fromAcc.exclude_from_total ?? false,
            }
          : null,
        to_account: toAcc
          ? {
              id: toAcc.id,
              account_name: toAcc.account_name,
              exclude_from_total: toAcc.exclude_from_total ?? false,
            }
          : null,
      };
    });
  }
}
