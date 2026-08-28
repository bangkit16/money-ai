import { supabase } from "@/lib/supabase";

export type TransactionType = "INCOME" | "EXPENSE";

export type CategoryRow = {
  id: number;
  category: string;
  slug: string;
  icon: string;
  category_type: string | null;
};

export type AccountOptionRow = {
  id: number;
  account_name: string;
};

export type InsertTransactionParams = {
  amount: number;
  transaction: string;
  transaction_type: TransactionType;
  category_id: number | null;
  account_id: number | null;
  to_account_id: number | null;
  created_at: string;
};

export class AddTransactionService {
  static readonly keys = {
    categories: (type: TransactionType) => ["category_transaction", type] as const,
    accounts: ["account"] as const, 
  };

  static async GetCategories(transactionType: TransactionType) {
    const { data, error } = await supabase
      .from("category_transaction")
      .select("*")
      .or(`category_type.eq.${transactionType},category_type.is.null`);
    if (error) throw new Error(error.message);
    return data as CategoryRow[];
  }

  static async GetAccountOptions() {
    const { data, error } = await supabase.from("account").select("*");
    if (error) throw new Error(error.message);
    return data as AccountOptionRow[];
  }

  // user_id WAJIB — dicek oleh RLS policy (auth.uid() = user_id)
  static async InsertTransaction(params: InsertTransactionParams) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User belum login");

    const { error } = await supabase.from("transaction").insert({
      ...params,
      user_id: user.id,
    });
    if (error) throw error;
  }

  static async UpdateTransaction(
    id: number,
    params: Partial<InsertTransactionParams>
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User belum login");

    const { error } = await supabase
      .from("transaction")
      .update(params)
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  }

  static async DeleteTransaction(id: number) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User belum login");

    const { error } = await supabase
      .from("transaction")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
  }
}
