import { accounts$, accountActions, type AccountEntity } from "@/store/accounts$";
import { transactions$ } from "@/store/transactions$";
import { supabase } from "@/lib/supabase";

export type AccountRow = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  is_primary: boolean;
  exclude_from_total: boolean;
};

export class AccountService {
  // ponytail: sinkron langsung dari Legend-State cache, fallback ke view Supabase bila perlu
  static async GetAccountsWithTotals(): Promise<AccountRow[]> {
    const rawAccounts = accounts$.peek() ?? {};
    const accList = Object.values(rawAccounts) as AccountEntity[];
    const rawTxs = transactions$.peek() ?? {};
    const txList = Object.values(rawTxs);

    return accList
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((acc) => {
        let total = 0;
        for (const tx of txList) {
          const amt = Number(tx.amount) || 0;
          if (tx.account_id === acc.id) {
            if (tx.transaction_type === "INCOME") total += amt;
            else total -= amt;
          }
          if (tx.to_account_id === acc.id) {
            total += amt;
          }
        }
        return {
          id: acc.id,
          account_name: acc.account_name,
          created_at: acc.created_at,
          user_id: acc.user_id,
          total_amount: total,
          is_primary: acc.is_primary ?? false,
          exclude_from_total: acc.exclude_from_total ?? false,
        };
      });
  }

  static async CreateAccount(accountName: string, excludeFromTotal = false) {
    return accountActions.create(accountName, excludeFromTotal);
  }

  static async UpdateAccount(
    id: number,
    accountName: string,
    excludeFromTotal?: boolean
  ) {
    accountActions.update(id, {
      account_name: accountName,
      exclude_from_total: excludeFromTotal,
    });
  }

  static async ToggleExcludeFromTotal(id: number, exclude: boolean) {
    accountActions.setExcludeFromTotal(id, exclude);
  }

  static async DeleteAccount(id: number) {
    accountActions.delete(id);
  }

  static async SetPrimaryAccount(id: number, isPrimary: boolean) {
    accountActions.setPrimary(id, isPrimary);
  }
}
