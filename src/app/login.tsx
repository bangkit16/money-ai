// migrated to useColor
import { GoogleSignInButton } from "@/components/features/login/google-sign-in-button";
import { LoginHero } from "@/components/features/login/login-hero";
import { Text } from "@/components/ui/text";
import { shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useToast } from "@/components/ui/toast";
import { createSessionFromUrl } from "@/lib/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const t = useT();

  const bgColor = useColor("background");
  const sheetColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const primaryColor = useColor("primary");

  // console.log(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!);
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
  });

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    setEmailLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setEmailLoading(false);
      return;
    }

    router.replace("/(tabs)");
    setEmailLoading(false);
  };

  const [consoleLog, setConsoleLog] = useState<string>("");

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            skipBrowserRedirect: true, // kita yang buka browser-nya manual di bawah
          },
        });
        if (error) throw error;
        console.log("Generated Redirect URL:", redirectTo);
        console.log("Supabase OAuth Data:", data);

        const authUrl = data?.url;
        console.log("[google-sign-in] authUrl:", authUrl);
        if (!authUrl) throw new Error("Supabase tidak mengembalikan auth URL");

        // Buka halaman login Google di browser bawaan (in-app), tunggu sampai
        // ke-redirect balik ke `redirectTo` (deep link app kita).
        const result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          redirectTo,
        );
        console.log("[google-sign-in] result:", result);

        if (result.type === "success" && result.url) {
          const session = await createSessionFromUrl(result.url);
          if (session) {
            router.replace("/(tabs)");
          }
        }
        return;
      }

      // Native (Android/iOS): account picker native, tanpa browser/deep link.
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      setConsoleLog(" Google sign-in response: " + JSON.stringify(response));
      const idToken = response.data?.idToken;
      if (!idToken) throw new Error("Tidak ada idToken dari Google");
      setConsoleLog(" Google sign-in idToken: " + idToken);

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });
      if (error) {
        toast.error("Gagal masuk dengan Google: " + error.message);
        setConsoleLog(" Google sign-in error: " + error.message);
        throw error;
      }

      setConsoleLog(" Google sign-in data: " + JSON.stringify(data));
      

      toast.success("Berhasil masuk dengan Google");
      if (data?.session) {
        toast.success("Berhasil Session dibuat");
        // await supabase.auth.setSession(data.session);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: bgColor }]}
      edges={["top"]}
    >
      <StatusBar style="light" />

      {/* Bagian atas: brand hero */}
      <LoginHero />

      {/* Bagian bawah: card sign-in (overlap ke hero) */}
      <View
        style={[styles.sheet, shadow.heroCard, { backgroundColor: sheetColor }]}
      >
        <View style={styles.sheetHeader}>
          <Text style={[styles.title, { color: textColor }]}>
            {t("login.welcome")}
          </Text>
          <Text style={[styles.subtitle, { color: textMutedColor }]}>
            {t("login.subtitle")}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={{ color: "#DC2626", fontSize: 11 }}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            { color: textColor, borderColor: textMutedColor + "40" },
          ]}
          placeholder="Email"
          placeholderTextColor={textMutedColor}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={[
            styles.input,
            { color: textColor, borderColor: textMutedColor + "40" },
          ]}
          placeholder="Password"
          placeholderTextColor={textMutedColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={[styles.emailButton, { backgroundColor: primaryColor }]}
          onPress={handleEmailLogin}
          disabled={emailLoading}
          activeOpacity={0.8}
        >
          {emailLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.emailButtonText}>Masuk</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: textMutedColor + "30" },
            ]}
          />
          <Text style={[styles.dividerText, { color: textMutedColor }]}>
            atau
          </Text>
          <View
            style={[
              styles.dividerLine,
              { backgroundColor: textMutedColor + "30" },
            ]}
          />
        </View>

        <GoogleSignInButton loading={loading} onPress={handleGoogleSignIn} />

        <TouchableOpacity
          onPress={() => router.replace("/register")}
          style={styles.linkBtn}
        >
          <Text style={[styles.linkText, { color: textMutedColor }]}>
            Belum punya akun?{" "}
            <Text style={{ color: primaryColor, fontFamily: "Poppins-Bold" }}>
              Daftar
            </Text>
          </Text>
          <Text style={[styles.linkText, { color: textMutedColor }]}>
            {consoleLog}
          </Text>
        </TouchableOpacity>

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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    marginTop: -20,
  },
  sheetHeader: {
    marginBottom: 20,
  },
  title: { ...typography.headlineLgMobile },
  subtitle: {
    ...typography.bodyLg,
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },
  emailButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  emailButtonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 11,
  },
  linkBtn: {
    alignItems: "center",
    marginTop: 12,
  },
  linkText: { fontSize: 11 },
  termsText: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 16,
  },
  termsLink: { fontSize: 10 },
});
