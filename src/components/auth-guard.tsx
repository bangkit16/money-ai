import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/constants/theme";
import { usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

/**
 * AuthGuard — komponen yang dipasang di root layout.
 * Tugasnya: arahkan user ke /login kalau belum sign-in, atau ke /(tabs)
 * kalau sudah sign-in tapi masih di /login. Route lain (modal/standalone
 * seperti /add-transaction) tidak di-intercept — itu bukan halaman
 * auth boundary.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const onLoginScreen = pathname === "/login";

    // Belum login → tendang ke /login, kecuali memang sudah di sana
    if (!isAuthenticated && !onLoginScreen) {
      router.replace("/login");
      return;
    }

    // Sudah login tapi masih di /login → masuk ke tabs
    if (isAuthenticated && onLoginScreen) {
      router.replace("/(tabs)");
      return;
    }
    // Route lain (modal, screens standalone) di-handle oleh screen masing-masing.
  }, [session, loading, isAuthenticated, segments, pathname, router]);

  if (loading) {
    return (
      <View style={styles.splash}>
        <Spinner size="lg" variant="circle" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});