import { categories$, type CategoryRow } from "@/store/categories$";
import { accounts$ } from "@/store/accounts$";
import { transactionActions, type TransactionType } from "@/store/transactions$";

export type { TransactionType, CategoryRow };

export type AccountOptionRow = {
  id: number;
  account_name: string;
  is_primary: boolean;
};

export type InsertTransactionParams = {
  amount: number;
  transaction: string;
  transaction_type: TransactionType;
  category_id: number | null;
  account_id: number | null;
  to_account_id: number | null;
  transaction_date: string;
};

export class AddTransactionService {
  static async GetCategories(transactionType: TransactionType): Promise<CategoryRow[]> {
    const rawCats = categories$.peek() ?? {};
    const all = Object.values(rawCats) as CategoryRow[];
    const filtered = all.filter(
      (c) => !c.category_type || c.category_type === transactionType
    );

    if (transactionType === "TRANSFER") {
      return filtered.filter(
        (row) => row.slug === "transfer" || row.slug === "others"
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.slug === "others") return 1;
      if (b.slug === "others") return -1;
      return 0;
    });
  }

  static async GetAccountOptions(): Promise<AccountOptionRow[]> {
    const rawAccounts = accounts$.peek() ?? {};
    return Object.values(rawAccounts).map((acc) => ({
      id: acc.id,
      account_name: acc.account_name,
      is_primary: acc.is_primary ?? false,
    }));
  }

  static async InsertTransaction(params: InsertTransactionParams) {
    return transactionActions.create({
      amount: params.amount,
      transaction: params.transaction,
      transaction_type: params.transaction_type,
      category_id: params.category_id,
      account_id: params.account_id,
      to_account_id: params.to_account_id,
      transaction_date: params.transaction_date,
    });
  }

  static async InsertTransfer(
    params: Omit<InsertTransactionParams, "transaction_type">
  ) {
    return transactionActions.create({
      ...params,
      transaction_type: "TRANSFER",
    });
  }

  static async UpdateTransaction(
    id: number,
    params: Partial<InsertTransactionParams>
  ) {
    transactionActions.update(id, params);
  }

  static async DeleteTransaction(id: number) {
    transactionActions.delete(id);
  }
}
