import { observable } from "@legendapp/state";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { supabase } from "@/lib/supabase";
import { user$ } from "./auth$";
import "./supabaseSync";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type TransactionEntity = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType;
  category_id: number | null;
  account_id: number | null;
  to_account_id: number | null;
  transaction_date: string;
  user_id: string;
};

export type InsertTransactionInput = {
  amount: number;
  transaction: string;
  transaction_type: TransactionType;
  category_id: number | null;
  account_id: number | null;
  to_account_id?: number | null;
  transaction_date?: string;
};

export const transactions$ = observable<Record<number, TransactionEntity>>(
  (syncedSupabase as any)({
    supabase,
    collection: "transaction",
    select: (from: any) =>
      from.select(
        "id, created_at, transaction, amount, transaction_type, category_id, account_id, to_account_id, transaction_date, user_id"
      ),
    filter: (query: any) => query.order("created_at", { ascending: false }),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "transactions_cache",
    },
    retry: {
      infinite: true,
    },
  })
);

export const transactionActions = {
  create(input: InsertTransactionInput) {
    const user = user$.peek();
    if (!user) throw new Error("User belum login");
    const id = Date.now();
    const now = new Date().toISOString();
    transactions$[id].set({
      id,
      created_at: now,
      transaction: input.transaction || null,
      amount: input.amount,
      transaction_type: input.transaction_type,
      category_id: input.category_id ?? null,
      account_id: input.account_id ?? null,
      to_account_id: input.to_account_id ?? null,
      transaction_date: input.transaction_date || now,
      user_id: user.id,
    });
    return id;
  },

  update(id: number, input: Partial<InsertTransactionInput>) {
    if (!transactions$[id]?.peek()) return;
    transactions$[id].assign(input as any);
  },

  delete(id: number) {
    transactions$[id]?.delete();
  },
};
