import { observable } from "@legendapp/state";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { supabase } from "@/lib/supabase";
import "./supabaseSync";

export type CategoryRow = {
  id: number;
  category: string;
  category_en: string | null;
  slug: string;
  icon: string;
  category_type: string | null;
};

export const categories$ = observable<Record<number, CategoryRow>>(
  syncedSupabase({
    supabase,
    collection: "category_transaction" as any,
    select: (from) => from.select("*"),
    actions: ["read"],
    persist: {
      name: "categories_cache",
    },
  })
);
