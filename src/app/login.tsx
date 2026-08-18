import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "../constants/theme";
import { Text } from "@/components/ui/text";
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
    <View style={styles.screen}>
      {/* Bagian atas: brand hero */}
      <LinearGradient
        colors={[colors.primary, colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="chart-donut"
            size={32}
            color={colors.white}
          />
        </View>
        <Text style={styles.wordmark}>WealthFlow</Text>
        <Text style={styles.tagline}>Quiet confidence for your money</Text>
      </LinearGradient>

      {/* Bagian bawah: card sign-in */}
      <View style={styles.sheet}>
        <View style={{ marginBottom: 32 }}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue tracking your finances.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.googleButton, shadow.card]}
          onPress={handleGoogleSignIn}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.onSurface} />
          ) : (
            <>
              <MaterialCommunityIcons
                name="google"
                size={20}
                color={colors.onSurface}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to WealthFlow's{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.marginMobile,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  wordmark: { ...typography.headlineLg, fontSize: 30, color: colors.white },
  tagline: {
    ...typography.bodyLg,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },

  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 32,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  title: { ...typography.headlineLgMobile, color: colors.onSurface },
  subtitle: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    marginTop: 6,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  googleButtonText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.onSurface,
  },

  termsText: {
    ...typography.bodySm,
    color: colors.outline,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
  termsLink: { color: colors.onSurfaceVariant, fontWeight: "600" },
});
