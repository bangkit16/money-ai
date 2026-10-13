import { accounts$, accountActions, type AccountEntity } from "@/store/accounts$";
import { transactions$ } from "@/store/transactions$";

export type AccountRow = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  is_primary: boolean;
};

export class AccountService {
  static async GetAccountsWithTotals(): Promise<AccountRow[]> {
    const rawAccounts = accounts$.peek() ?? {};
    const accList = Object.values(rawAccounts) as AccountEntity[];
    const rawTxs = transactions$.peek() ?? {};
    const txList = Object.values(rawTxs);

    return accList
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((acc) => {
        let totalAmount = 0;

        for (const tx of txList) {
          const amt = Number(tx.amount) || 0;
          if (tx.account_id === acc.id) {
            if (tx.transaction_type === "INCOME") totalAmount += amt;
            else totalAmount -= amt;
          }
          if (tx.to_account_id === acc.id) {
            totalAmount += amt;
          }
        }

        return {
          id: acc.id,
          created_at: acc.created_at,
          account_name: acc.account_name,
          user_id: acc.user_id,
          total_amount: totalAmount,
          is_primary: acc.is_primary ?? false,
        };
      });
  }

  static async CreateAccount(accountName: string) {
    accountActions.create(accountName);
  }

  static async UpdateAccount(id: number, accountName: string) {
    accountActions.update(id, accountName);
  }

  static async DeleteAccount(id: number) {
    accountActions.delete(id);
  }

  static async SetPrimaryAccount(id: number, isPrimary: boolean) {
    accountActions.setPrimary(id, isPrimary);
  }
}
