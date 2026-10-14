import { observable } from "@legendapp/state";
import { supabase } from "@/lib/supabase";
import { user$ } from "./auth$";

export type ProfileEntity = {
  id: string;
  is_pro: boolean;
  pro_expires_at: string | null;
  ai_daily_usage: number;
  last_ai_usage_date: string;
  created_at?: string;
  updated_at?: string;
};

const defaultProfile: ProfileEntity = {
  id: "",
  is_pro: false,
  pro_expires_at: null,
  ai_daily_usage: 0,
  last_ai_usage_date: new Date().toISOString().split("T")[0],
};

export const profile$ = observable<ProfileEntity>(defaultProfile);

export const isPro$ = observable<boolean>(() => profile$.is_pro.get() ?? false);

export const aiQuota$ = observable(() => {
  const isPro = profile$.is_pro.get() ?? false;
  const usage = profile$.ai_daily_usage.get() ?? 0;
  const max = isPro ? 60 : 5;
  const remaining = Math.max(0, max - usage);
  return {
    isPro,
    usage,
    max,
    remaining,
  };
});

let profileSubscription: ReturnType<typeof supabase.channel> | null = null;

export async function refreshProfile() {
  const user = user$.peek();
  if (!user) {
    profile$.set(defaultProfile);
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!error && data) {
    profile$.set({
      id: data.id,
      is_pro: data.is_pro ?? false,
      pro_expires_at: data.pro_expires_at ?? null,
      ai_daily_usage: data.ai_daily_usage ?? 0,
      last_ai_usage_date: data.last_ai_usage_date ?? new Date().toISOString().split("T")[0],
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }
}

function setupProfileSubscription(userId: string) {
  if (profileSubscription) {
    profileSubscription.unsubscribe();
  }

  profileSubscription = supabase
    .channel(`profile-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        if (payload.new) {
          profile$.assign(payload.new as any);
        }
      }
    )
    .subscribe();
}

supabase.auth.getSession().then(({ data }) => {
  if (data?.session?.user) {
    refreshProfile();
    setupProfileSubscription(data.session.user.id);
  }
});

supabase.auth.onAuthStateChange((_event, newSession) => {
  if (newSession?.user) {
    refreshProfile();
    setupProfileSubscription(newSession.user.id);
  } else {
    if (profileSubscription) {
      profileSubscription.unsubscribe();
      profileSubscription = null;
    }
    profile$.set(defaultProfile);
  }
});
