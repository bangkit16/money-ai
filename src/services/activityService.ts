import { supabase } from "@/lib/supabase";
import type { TransactionType } from "@/services/addTransactionService";

export type ActivityTransactionRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category: { id: number; category: string; slug: string } | null;
};

export class ActivityService {
  static readonly keys = {
    transactions: ["transactions"] as const,
  };

  static async GetTransactions() {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        "id, created_at, transaction, amount, transaction_type, category:category_transaction(id, category, slug)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as unknown as ActivityTransactionRow[];
  }
}
