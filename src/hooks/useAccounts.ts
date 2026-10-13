import { useSelector } from "@legendapp/state/react";
import { accounts$, accountActions, type AccountEntity } from "@/store/accounts$";
import { transactions$ } from "@/store/transactions$";
import type { AccountRow } from "@/services/accountService";

export function useAccounts() {
  const accountsWithTotals = useSelector(() => {
    const rawAccounts = accounts$.get() ?? {};
    const accList = Object.values(rawAccounts) as AccountEntity[];
    const rawTxs = transactions$.get() ?? {};
    const txList = Object.values(rawTxs);

    return accList
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((acc) => {
        let total = 0;
        for (const tx of txList) {
          const amt = Number(tx.amount) || 0;
          if (tx.account_id === acc.id) {
            if (tx.transaction_type === "INCOME") total += amt;
            else total -= amt; // EXPENSE atau TRANSFER keluar
          }
          if (tx.to_account_id === acc.id) {
            total += amt; // TRANSFER masuk
          }
        }
        return {
          id: acc.id,
          account_name: acc.account_name,
          created_at: acc.created_at,
          user_id: acc.user_id,
          total_amount: total,
          is_primary: acc.is_primary ?? false,
        } as AccountRow;
      });
  });

  const accountOptions = useSelector(() => {
    const rawAccounts = accounts$.get() ?? {};
    return Object.values(rawAccounts).map((acc) => ({
      id: acc.id,
      account_name: acc.account_name,
      is_primary: acc.is_primary ?? false,
    }));
  });

  return {
    accounts: accountsWithTotals,
    accountOptions,
    createAccount: accountActions.create,
    updateAccount: accountActions.update,
    deleteAccount: accountActions.delete,
    setPrimaryAccount: accountActions.setPrimary,
  };
}
