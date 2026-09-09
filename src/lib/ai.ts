import { supabase } from "@/lib/supabase";

export type AiCategory = {
  id: number;
  category: string;
  slug: string;
};

export type AiTransactionDraft = {
  amount: number;
  transaction_type: "EXPENSE" | "INCOME" | "TRANSFER";
  description: string;
  category_slug?: string;
  category?: AiCategory | null;
  account_id?: number | null;
  account_name?: string;
  to_account_name?: string;
  to_account_id?: number | null;
};

export type AiPromptResult =
  | { action: "confirm_transaction"; data: AiTransactionDraft }
  | { action: "show_result"; tool: string; data: any }
  | { action: "text_answer"; message: string };

export async function askAi(prompt: string): Promise<AiPromptResult> {
  const { data, error } = await supabase.functions.invoke("ai-prompt", {
    body: { prompt },
  });
  console.log("AI Prompt Result:", data, error);
  if (error) throw error;
  return data as AiPromptResult;
}

export function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatQueryResult(tool: string, data: any): string {
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

    default:
      return "Hasil tidak dikenali.";
  }
}
