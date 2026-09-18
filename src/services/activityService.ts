import { supabase } from "@/lib/supabase";
import type { TransactionType } from "@/services/addTransactionService";

export type ActivityTransactionRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category: { id: number; category: string; category_en: string | null; slug: string; icon: string } | null;
  from_account: { id: number; account_name: string } | null;
  to_account: { id: number; account_name: string } | null;
};

export class ActivityService {
  static async GetTransactions(page = 0, limit = 10, filter: "all" | TransactionType = "all", search = "") {
    const offset = page * limit;
    let query = supabase
      .from("transaction")
      .select(
        "id, created_at, transaction, amount, transaction_type, category:category_transaction(id, category, category_en, slug, icon), from_account:account!account_id(id, account_name), to_account:account!to_account_id(id, account_name)",
      )
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("transaction_type", filter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      query = query.ilike("transaction", `%${q}%`);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) throw new Error(error.message);
    return data as unknown as ActivityTransactionRow[];
  }
}
