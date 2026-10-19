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

export function getTodayUtcString(): string {
  return new Date().toISOString().split("T")[0];
}

export function isAiUsageExpired(lastDate?: string | null): boolean {
  if (!lastDate) return false;
  return lastDate < getTodayUtcString();
}

const defaultProfile: ProfileEntity = {
  id: "",
  is_pro: false,
  pro_expires_at: null,
  ai_daily_usage: 0,
  last_ai_usage_date: getTodayUtcString(),
};

export const profile$ = observable<ProfileEntity>(defaultProfile);

export const isPro$ = observable<boolean>(() => profile$.is_pro.get() ?? false);

export const aiQuota$ = observable(() => {
  const isPro = profile$.is_pro.get() ?? false;
  const lastDate = profile$.last_ai_usage_date.get();
  const rawUsage = profile$.ai_daily_usage.get() ?? 0;
  const usage = isAiUsageExpired(lastDate) ? 0 : rawUsage;
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
    const expired = isAiUsageExpired(data.last_ai_usage_date);
    profile$.set({
      id: data.id,
      is_pro: data.is_pro ?? false,
      pro_expires_at: data.pro_expires_at ?? null,
      ai_daily_usage: expired ? 0 : (data.ai_daily_usage ?? 0),
      last_ai_usage_date: data.last_ai_usage_date ?? getTodayUtcString(),
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
          const newProfile = payload.new as any;
          const expired = isAiUsageExpired(newProfile.last_ai_usage_date);
          profile$.assign({
            ...newProfile,
            ai_daily_usage: expired ? 0 : (newProfile.ai_daily_usage ?? 0),
          });
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
