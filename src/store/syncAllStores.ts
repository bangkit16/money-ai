import { syncState } from "@legendapp/state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accounts$ } from "./accounts$";
import { transactions$ } from "./transactions$";
import { categories$ } from "./categories$";
import { refreshProfile } from "./profile$";

/**
 * Sinkronisasi seluruh store dari Supabase ke state lokal.
 * Wajib dipanggil saat login / sesi auth baru aktif.
 */
export async function syncAllStores(): Promise<void> {
  await Promise.allSettled([
    refreshProfile(),
    syncState(accounts$).sync(),
    syncState(transactions$).sync(),
    syncState(categories$).sync(),
  ]);
}

/**
 * Reset seluruh store dan hapus cache AsyncStorage saat logout.
 */
export async function clearAllStores(): Promise<void> {
  accounts$.set({});
  transactions$.set({});
  categories$.set({});
  await refreshProfile();
  await AsyncStorage.multiRemove([
    "accounts_cache",
    "transactions_cache",
    "categories_cache",
  ]).catch(() => {});
}

