import type { QueryClient } from "@tanstack/react-query";

/** Invalidate all query caches that may change after a transaction mutation */
export function invalidateTransactionCaches(client: QueryClient) {
  client.invalidateQueries({ queryKey: ["transactions"] });
  client.invalidateQueries({ queryKey: ["account"] });
  client.invalidateQueries({ queryKey: ["accounts-with-totals"] });
  client.invalidateQueries({ queryKey: ["dashboard-transactions"] });
  client.invalidateQueries({ queryKey: ["dashboard-recent-transactions"] });
  client.invalidateQueries({ queryKey: ["analytics-current-month"] });
}

/** Invalidate caches after deleting a transaction (also includes the transaction itself) */
export function invalidateAfterDelete(client: QueryClient, transactionId: number) {
  invalidateTransactionCaches(client);
  client.invalidateQueries({ queryKey: ["transaction", String(transactionId)] });
}
