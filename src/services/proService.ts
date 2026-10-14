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
   * Mengaktifkan status Pro di Supabase untuk pengujian / via RevenueCat webhook
   */
  static async activatePro(durationMonths: number): Promise<boolean> {
    const user = user$.peek();
    if (!user) throw new Error("User belum login");

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

    const { error } = await supabase
      .from("profiles")
      .update({
        is_pro: true,
        pro_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Gagal aktivasi Pro:", error);
      return false;
    }

    await refreshProfile();
    return true;
  }

  /**
   * Restore pembelian
   */
  static async restorePurchases(): Promise<boolean> {
    await refreshProfile();
    return profile$.is_pro.peek() ?? false;
  }
}
