import type { QueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/query-keys";

/** Invalidate all query caches that may change after a transaction mutation */
export function invalidateTransactionCaches(client: QueryClient) {
  client.invalidateQueries({ queryKey: QueryKeys.transactions });
  client.invalidateQueries({ queryKey: QueryKeys.accounts });
  client.invalidateQueries({ queryKey: QueryKeys.dashboardTransactions });
  client.invalidateQueries({ queryKey: QueryKeys.dashboardRecentTransactions });
  client.invalidateQueries({ queryKey: QueryKeys.analyticsCurrentMonth });
}

/** Invalidate caches after deleting a transaction (also includes the transaction itself) */
export function invalidateAfterDelete(client: QueryClient, transactionId: number) {
  invalidateTransactionCaches(client);
  client.invalidateQueries({ queryKey: QueryKeys.transaction(transactionId) });
}
