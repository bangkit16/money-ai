// migrated to useColor
import { GoogleSignInButton } from "@/components/features/login/google-sign-in-button";
import { LoginHero } from "@/components/features/login/login-hero";
import { Text } from "@/components/ui/text";
import { radius, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { createSessionFromUrl } from "@/lib/auth";

// Wajib dipanggil di level module supaya WebBrowser tahu kapan harus
// menutup sesi auth-nya sendiri saat browser di-redirect balik ke app.
WebBrowser.maybeCompleteAuthSession();

// Harus SAMA PERSIS dengan salah satu "Redirect URLs" yang kamu daftarkan
// di Supabase Dashboard -> Authentication -> URL Configuration.
const redirectTo = Linking.createURL("/auth-callback");

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const bgColor = useColor("background");
  const sheetColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");

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
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      {/* Bagian atas: brand hero */}
      <LoginHero />

      {/* Bagian bawah: card sign-in */}
      <View style={[styles.sheet, { backgroundColor: sheetColor }]}>
        <View style={{ marginBottom: 32 }}>
          <Text style={[styles.title, { color: textColor }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: textMutedColor }]}>
            Sign in to continue tracking your finances.
          </Text>
        </View>

        <GoogleSignInButton loading={loading} onPress={handleGoogleSignIn} />

        <Text style={[styles.termsText, { color: borderColor }]}>
          By continuing, you agree to {"Dompety's"}{" "}
          <Text style={[styles.termsLink, { color: textMutedColor }]}>Terms of Service</Text> and{" "}
          <Text style={[styles.termsLink, { color: textMutedColor }]}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 32,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  title: { ...typography.headlineLgMobile },
  subtitle: {
    ...typography.bodyLg,
    marginTop: 6,
  },

  termsText: {
    ...typography.bodySm,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
  termsLink: { fontWeight: "600" },
});