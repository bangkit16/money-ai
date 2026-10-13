import { useSelector } from "@legendapp/state/react";
import { transactions$, transactionActions, type TransactionEntity, type TransactionType } from "@/store/transactions$";
import { categories$, type CategoryRow } from "@/store/categories$";
import { accounts$ } from "@/store/accounts$";
import type { ActivityTransactionRow } from "@/services/activityService";

export function useTransactions() {
  const enrichedTransactions = useSelector(() => {
    const rawTxs = transactions$.get() ?? {};
    const rawCats = categories$.get() ?? {};
    const rawAccs = accounts$.get() ?? {};

    const list = Object.values(rawTxs) as TransactionEntity[];

    list.sort((a, b) => {
      const da = new Date(a.transaction_date || a.created_at).getTime();
      const db = new Date(b.transaction_date || b.created_at).getTime();
      return db - da;
    });

    return list.map((tx) => {
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
      } as ActivityTransactionRow;
    });
  });

  const recentTransactions = useSelector(() => {
    return enrichedTransactions.slice(0, 3);
  });

  const getCategoriesByType = (type: TransactionType) => {
    const rawCats = categories$.peek() ?? {};
    const all = Object.values(rawCats) as CategoryRow[];
    const filtered = all.filter(
      (c) => !c.category_type || c.category_type === type
    );

    if (type === "TRANSFER") {
      return filtered.filter(
        (row) => row.slug === "transfer" || row.slug === "others"
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.slug === "others") return 1;
      if (b.slug === "others") return -1;
      return 0;
    });
  };

  return {
    transactions: enrichedTransactions,
    recentTransactions,
    getCategoriesByType,
    createTransaction: transactionActions.create,
    updateTransaction: transactionActions.update,
    deleteTransaction: transactionActions.delete,
  };
}
