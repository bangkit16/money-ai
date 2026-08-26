import { supabase } from "@/lib/supabase";
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
  category: { category: string; slug: string } | null;
  account: { account_name: string } | null;
};

export class DashboardService {
  static readonly keys = {
    transactions: ["dashboard-transactions"] as const,
    recentTransactions: ["dashboard-recent-transactions"] as const,
  };

  static async GetTransactions() {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        "amount, transaction_type, created_at, account:account(id, account_name)",
      );
    if (error) throw new Error(error.message);
    return data as unknown as DashboardTxRow[];
  }

  static async GetRecentTransactions() {
    const { data, error } = await supabase
      .from("transaction")
      .select(
        "id, created_at, transaction, amount, transaction_type, category:category_transaction(category, slug), account:account(account_name)",
      )
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) throw new Error(error.message);
    return data as unknown as RecentTxRow[];
  }
}
