import { observable } from "@legendapp/state";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const session$ = observable<Session | null>(null);
export const user$ = observable<User | null>(() => session$.get()?.user ?? null);
export const isAuthenticated$ = observable<boolean>(() => !!session$.get());

// Inisialisasi session dan dengarkan perubahan auth Supabase
supabase.auth.getSession().then(({ data }) => {
  session$.set(data.session);
});

supabase.auth.onAuthStateChange((_event, newSession) => {
  session$.set(newSession);
});
