import { supabase } from "@/lib/supabase";
import { user$ } from "@/store/auth$";
import { profile$, refreshProfile } from "@/store/profile$";

export type SubscriptionPlan = "monthly" | "yearly";

export const PRO_PRICING = {
  monthly: {
    id: "money_ai_monthly_14900",
    name: "Bulanan",
    priceText: "Rp14.900",
    periodText: "/ bulan",
    priceNumber: 14900,
  },
  yearly: {
    id: "money_ai_yearly_129000",
    name: "Tahunan",
    priceText: "Rp129.000",
    periodText: "/ tahun",
    priceNumber: 129000,
    discountBadge: "Hemat 28%",
  },
} as const;

export class ProService {
  /**
   * Aktivasi Pro harus via webhook payment gateway / StoreKit / Play Billing.
   * Client-side direct update dinonaktifkan (vulnerability fix).
   */
  static async activatePro(_durationMonths: number): Promise<boolean> {
    // ponytail: ditutup demi keamanan. Sambungkan ke Edge Function verifikasi receipt IAP.
    throw new Error("Aktivasi Pro harus melalui verifikasi server / IAP.");
  }

  /**
   * Restore pembelian
   */
  static async restorePurchases(): Promise<boolean> {
    await refreshProfile();
    return profile$.is_pro.peek() ?? false;
  }
}
