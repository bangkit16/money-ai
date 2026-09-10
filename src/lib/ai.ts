import { supabase } from "@/lib/supabase";

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

export async function askAi(prompt: string): Promise<AiPromptResult> {
  const { data, error } = await supabase.functions.invoke("ai-prompt", {
    body: { prompt },
  });
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
