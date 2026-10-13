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
  exclude_from_total?: boolean;
};

export const accounts$ = observable<Record<number, AccountEntity>>(
  syncedSupabase({
    supabase,
    collection: "account" as any,
    select: (from) => from.select("*"),
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
  create(accountName: string, excludeFromTotal = false) {
    const user = user$.peek();
    if (!user) throw new Error("User belum login");
    const id = Date.now();
    accounts$[id].set({
      id,
      account_name: accountName,
      created_at: new Date().toISOString(),
      user_id: user.id,
      is_primary: false,
      exclude_from_total: excludeFromTotal,
    });
    return id;
  },

  update(
    id: number,
    input: string | { account_name?: string; exclude_from_total?: boolean }
  ) {
    if (!accounts$[id]?.peek()) return;
    if (typeof input === "string") {
      accounts$[id].account_name.set(input);
    } else {
      if (input.account_name !== undefined) {
        accounts$[id].account_name.set(input.account_name);
      }
      if (input.exclude_from_total !== undefined) {
        accounts$[id].exclude_from_total.set(input.exclude_from_total);
      }
    }
  },

  delete(id: number) {
    accounts$[id]?.delete();
  },

  setExcludeFromTotal(id: number, exclude: boolean) {
    if (!accounts$[id]?.peek()) return;
    accounts$[id].exclude_from_total.set(exclude);
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
