import { supabase } from "@/lib/supabase";

// Sesuai schema Supabase: id int8, created_at timestamptz, account_name varchar, user_id uuid
export type AccountRow = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
  total_amount: number;
};

export class AccountService {
  static readonly keys = {
    all: ["account"] as const,
  };

  static async GetAccountsWithTotals() {
    const { data, error } = await supabase
      .from("account_with_totals")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    console.log(data);
    return data as AccountRow[];
  }

  static async CreateAccount(accountName: string) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error("User belum login");

    const { error } = await supabase
      .from("account")
      .insert({ account_name: accountName, user_id: user.id });
    if (error) throw error;
  }

  static async UpdateAccount(id: number, accountName: string) {
    const { error } = await supabase
      .from("account")
      .update({ account_name: accountName })
      .eq("id", id);
    if (error) throw error;
  }

  static async DeleteAccount(id: number) {
    const { error } = await supabase.from("account").delete().eq("id", id);
    if (error) throw error;
  }
}
