import { supabase } from "@/lib/supabase";

// Sesuai schema Supabase: id int8, created_at timestamptz, account_name varchar, user_id uuid
export type AccountRow = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
  total_amount: number;
};

type TxAmount = { transaction_type: string; amount: number };

export class AccountService {
  static readonly keys = {
    all: ["account"] as const,
  };

  static async GetAccountsWithTotals() {
    const { data, error } = await supabase
      .from("account")
      .select(
        `
      id,
      created_at,
      account_name,
      user_id,
      outgoing:transaction!account_id (
        transaction_type,
        amount
      ),
      incoming:transaction!to_account_id (
        transaction_type,
        amount
      )
      `,
      )
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    const mappedData = data.map((acc) => {
      let totalAmount = 0;

      // Sisi keluar dari akun ini: INCOME nambah, EXPENSE & TRANSFER (keluar) mengurangi
      for (const tx of acc.outgoing as TxAmount[]) {
        const amt = Number(tx.amount) || 0;
        if (tx.transaction_type === "INCOME") totalAmount += amt;
        else totalAmount -= amt; // EXPENSE atau TRANSFER keluar
      }

      // Sisi masuk ke akun ini: cuma TRANSFER yang bisa punya to_account_id,
      // jadi baris di sini selalu berarti "transfer masuk" -> nambah saldo
      for (const tx of acc.incoming as TxAmount[]) {
        const amt = Number(tx.amount) || 0;
        totalAmount += amt;
      }

      return {
        id: acc.id,
        created_at: acc.created_at,
        account_name: acc.account_name,
        user_id: acc.user_id,
        total_amount: totalAmount,
      };
    });

    console.log("goodwell", mappedData);
    return mappedData as AccountRow[];
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
