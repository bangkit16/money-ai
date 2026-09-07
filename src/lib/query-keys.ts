import type { TransactionType } from "@/services/addTransactionService";

/** Centralized query keys — one source of truth */
export const QueryKeys = {
  // Transaction
  transaction: (id: number | string) => ["transaction", String(id)] as const,
  categories: (type: TransactionType) =>
    ["category_transaction", type] as const,
  accounts: ["account"] as const,

  // Activity
  transactions: ["transactions"] as const,

  // Dashboard
  dashboardTransactions: ["dashboard-transactions"] as const,
  dashboardRecentTransactions: ["dashboard-recent-transactions"] as const,

  // Analytics
  analyticsCurrentMonth: ["analytics-current-month"] as const,
} as const;
