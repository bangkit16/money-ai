// migrated to useColor
import { GoogleSignInButton } from "@/components/features/login/google-sign-in-button";
import { LoginHero } from "@/components/features/login/login-hero";
import { Text } from "@/components/ui/text";
import { shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { createSessionFromUrl } from "@/lib/auth";

// Wajib dipanggil di level module supaya WebBrowser tahu kapan harus
// menutup sesi auth-nya sendiri saat browser di-redirect balik ke app.
WebBrowser.maybeCompleteAuthSession();

// Returns the correct URI for the current environment:
// - Expo Go:    https://auth.expo.io/@username/project-slug/auth-callback
// - Standalone: dompety:///auth-callback
const redirectTo = makeRedirectUri({
  scheme: "dompety",
  path: "auth-callback",
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const t = useT();

  const bgColor = useColor("background");
  const sheetColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true, // kita yang buka browser-nya manual di bawah
        },
      });
      if (error) throw error;

      const authUrl = data?.url;
      if (!authUrl) throw new Error("Supabase tidak mengembalikan auth URL");

      // Buka halaman login Google di browser bawaan (in-app), tunggu sampai
      // ke-redirect balik ke `redirectTo` (deep link app kita).
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);

      if (result.type === "success" && result.url) {
        const session = await createSessionFromUrl(result.url);
        if (session) {
          router.replace("/(tabs)");
        }
      }
      // result.type === 'cancel' / 'dismiss' -> user membatalkan, tidak perlu apa-apa
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: bgColor }]} edges={["top"]}>
      <StatusBar style="light" />

      {/* Bagian atas: brand hero */}
      <LoginHero />

      {/* Bagian bawah: card sign-in (overlap ke hero) */}
      <View style={[styles.sheet, shadow.heroCard, { backgroundColor: sheetColor }]}>
        <View style={styles.sheetHeader}>
          <Text style={[styles.title, { color: textColor }]}>{t("login.welcome")}</Text>
          <Text style={[styles.subtitle, { color: textMutedColor }]}>
            {t("login.subtitle")}
          </Text>
        </View>

        <GoogleSignInButton loading={loading} onPress={handleGoogleSignIn} />

        <Text style={[styles.termsText, { color: textMutedColor }]}>
          {t("login.terms", { brand: "Dompety's" })}
          <Text style={styles.termsLink}>{t("login.termsOfService")}</Text>
          {t("login.termsAnd")}
          <Text style={styles.termsLink}>{t("login.privacyPolicy")}</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 28,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    marginTop: -24,
  },
  sheetHeader: {
    marginBottom: 24,
  },
  title: { ...typography.headlineLgMobile },
  subtitle: {
    ...typography.bodyLg,
    marginTop: 6,
  },

  termsText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 20,
  },
  termsLink: { fontSize: 12 },
});