import { observable } from "@legendapp/state";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { supabase } from "@/lib/supabase";
import { user$ } from "./auth$";
import "./supabaseSync";

export type AccountEntity = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
  is_primary: boolean;
};

export const accounts$ = observable<Record<number, AccountEntity>>(
  syncedSupabase({
    supabase,
    collection: "account" as any,
    select: (from) => from.select("id, account_name, created_at, user_id, is_primary"),
    filter: (query) => query.order("created_at", { ascending: true }),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "accounts_cache",
    },
    retry: {
      infinite: true,
    },
  })
);

export const accountActions = {
  create(accountName: string) {
    const user = user$.peek();
    if (!user) throw new Error("User belum login");
    const id = Date.now();
    accounts$[id].set({
      id,
      account_name: accountName,
      created_at: new Date().toISOString(),
      user_id: user.id,
      is_primary: false,
    });
    return id;
  },

  update(id: number, accountName: string) {
    if (!accounts$[id]?.peek()) return;
    accounts$[id].account_name.set(accountName);
  },

  delete(id: number) {
    accounts$[id]?.delete();
  },

  setPrimary(id: number, isPrimary: boolean) {
    if (!accounts$[id]?.peek()) return;
    if (isPrimary) {
      const all = accounts$.peek() ?? {};
      Object.values(all).forEach((acc) => {
        if (acc && acc.id !== id && acc.is_primary) {
          accounts$[acc.id].is_primary.set(false);
        }
      });
    }
    accounts$[id].is_primary.set(isPrimary);
  },
};
