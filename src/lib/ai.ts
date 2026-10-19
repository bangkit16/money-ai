import { supabase } from "@/lib/supabase";
import { user$ } from "@/store/auth$";
import { getTodayUtcString, profile$ } from "@/store/profile$";

export type AiCategory = {
  id: number;
  category: string;
  category_en?: string;
  category_type?: string;
  slug: string;
};

export type AiTransactionItem = {
  amount: number;
  transaction_type: "EXPENSE" | "INCOME" | "TRANSFER";
  description: string;
  category_slug?: string;
  category: AiCategory | null;
  category_id: number | null;
  account_name?: string;
  account_id: number | null;
  to_account_name?: string;
  to_account_id: number | null;
};

/** Alias untuk kompatibilitas dengan komponen yang sudah ada */
export type AiTransactionDraft = AiTransactionItem;

export type AiDeleteTarget = {
  id: number;
  transaction: string;
  amount: number;
  transaction_type: "EXPENSE" | "INCOME" | "TRANSFER";
  transaction_date: string;
  category_id: number | null;
  account_id: number | null;
};

export type AiUpdateChanges = Partial<{
  amount: number;
  transaction_type: "EXPENSE" | "INCOME" | "TRANSFER";
  transaction: string;
  category_id: number;
  category: AiCategory;
}>;

export type AiUpdatePayload = {
  transaction_id: number;
  before: {
    id: number;
    transaction: string;
    amount: number;
    transaction_type: "EXPENSE" | "INCOME" | "TRANSFER";
    transaction_date: string;
    category: AiCategory | null;
  };
  changes: AiUpdateChanges;
};

export type AiShowResultTool =
  | "query_top_category"
  | "query_total"
  | "query_top_transaction"
  | "query_balance";

export type AiPromptResult =
  | { action: "confirm_transaction"; data: { items: AiTransactionItem[] } }
  | { action: "show_result"; tool: AiShowResultTool; data: any }
  | { action: "text_answer"; message: string }
  | { action: "confirm_delete"; data: AiDeleteTarget }
  | { action: "confirm_update"; data: AiUpdatePayload };

export class AiQuotaExceededError extends Error {
  isPro: boolean;
  maxQuota: number;

  constructor(isPro: boolean, maxQuota: number) {
    super(
      isPro
        ? `Batas harian AI Pro tercapai (${maxQuota}/${maxQuota}). Kuota akan direset besok.`
        : `Batas harian AI Free tercapai (${maxQuota}/${maxQuota}). Tonton iklan atau upgrade ke Pro.`
    );
    this.name = "AiQuotaExceededError";
    this.isPro = isPro;
    this.maxQuota = maxQuota;
  }
}

export async function askAi(prompt: string): Promise<AiPromptResult> {
  const user = user$.peek();
  if (!user) throw new Error("Silakan login terlebih dahulu.");

  // Atomic quota check & increment di Supabase
  const { data: quotaCheck, error: rpcError } = await supabase.rpc(
    "check_and_increment_ai_usage",
    { p_user_id: user.id }
  );

  if (rpcError) {
    console.error("Quota check RPC error:", rpcError);
    throw new Error("Gagal memvalidasi kuota AI.");
  }

  if (quotaCheck && !quotaCheck.allowed) {
    throw new AiQuotaExceededError(quotaCheck.is_pro, quotaCheck.max_quota);
  }

  if (quotaCheck) {
    profile$.ai_daily_usage.set(quotaCheck.current_usage);
    profile$.is_pro.set(quotaCheck.is_pro);
    profile$.last_ai_usage_date.set(getTodayUtcString());
  }

  const { data, error } = await supabase.functions.invoke("ai-prompt", {
    body: { prompt },
  });
  if (error) throw error;
  return data as AiPromptResult;
}

export async function claimRewardedAiBonus(): Promise<boolean> {
  const user = user$.peek();
  if (!user) return false;

  // ponytail: user_id & bonus dipindah ke server RPC demi cegah manipulasi client
  const { data, error } = await supabase.rpc("add_rewarded_ai_usage");

  if (error) {
    console.error("Bonus claim error:", error);
    return false;
  }

  if (data?.success) {
    profile$.ai_daily_usage.set(data.current_usage);
    profile$.last_ai_usage_date.set(getTodayUtcString());
    return true;
  }
  return false;
}


export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatQueryResult(tool: AiShowResultTool, data: any): string {
  switch (tool) {
    case "query_top_category": {
      const row = Array.isArray(data) ? data[0] : null;
      if (!row) return "Belum ada transaksi di periode ini.";
      return `Kategori tertinggi kamu adalah ${row.category} dengan total ${formatRupiah(row.total)}.`;
    }

    case "query_total": {
      const total = typeof data === "number" ? data : 0;
      return `Total transaksi kamu: ${formatRupiah(total)}.`;
    }

    case "query_top_transaction": {
      const rows = Array.isArray(data) ? data : [];
      if (rows.length === 0) return "Tidak ada transaksi di periode ini.";
      const top = rows[0];
      return `Transaksi tertinggi: ${top.description} sebesar ${formatRupiah(top.amount)} (${top.category ?? "tanpa kategori"}).`;
    }

    case "query_balance": {
      const rows = Array.isArray(data) ? data : [];
      if (rows.length === 0) return "Belum ada akun yang tercatat.";
      if (rows.length === 1) {
        return `Saldo ${rows[0].account_name}: ${formatRupiah(rows[0].balance)}.`;
      }
      return rows
        .map((r: any) => `${r.account_name}: ${formatRupiah(r.balance)}`)
        .join("\n");
    }

    default:
      return "Hasil tidak dikenali.";
  }
}
