import { supabase } from "@/lib/supabase";
import type { TransactionType } from "@/services/addTransactionService";

export type ActivityTransactionRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category: { id: number; category: string; slug: string } | null;
  from_account: { id: number; account_name: string } | null;
  to_account: { id: number; account_name: string } | null;
};

export class ActivityService {
  static readonly keys = {
    transactions: ["transactions"] as const,
  };

  static async GetTransactions() {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        "id, created_at, transaction, amount, transaction_type, category:category_transaction(id, category, slug), from_account:account!account_id(id, account_name), to_account:account!to_account_id(id, account_name)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as unknown as ActivityTransactionRow[];
  }
}
