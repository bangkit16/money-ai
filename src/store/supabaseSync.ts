import { configureObservableSync } from "@legendapp/state/sync";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { configureSyncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAuthenticated$ } from "./auth$";

// Konfigurasi persistensi lokal AsyncStorage + auto-retry saat offline
configureObservableSync({
  persist: {
    plugin: ObservablePersistAsyncStorage,
    asyncStorage: {
      AsyncStorage,
    },
    retrySync: true,
  },
  retry: {
    infinite: true,
    backoff: "exponential",
    maxDelay: 30000,
  },
});

// Konfigurasi Supabase sync: hanya aktif saat user login & ID numerik berbasis timestamp
configureSyncedSupabase({
  enabled: isAuthenticated$,
  generateId: () => Date.now(),
});

export { ObservablePersistAsyncStorage };
