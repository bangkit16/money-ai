import { observable } from "@legendapp/state";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const session$ = observable<Session | null>(null);
export const user$ = observable<User | null>(() => session$.get()?.user ?? null);
export const isAuthenticated$ = observable<boolean>(() => !!session$.get());

// Inisialisasi session dan dengarkan perubahan auth Supabase
supabase.auth.getSession().then(({ data }) => {
  session$.set(data.session);
  if (data.session?.user) {
    import("./syncAllStores").then((m) => m.syncAllStores());
  }
});

supabase.auth.onAuthStateChange((event, newSession) => {
  session$.set(newSession);
  if (
    newSession?.user &&
    (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")
  ) {
    import("./syncAllStores").then((m) => m.syncAllStores());
  }
});
