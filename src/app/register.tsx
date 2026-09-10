import { LoginHero } from "@/components/features/login/login-hero";
import { Text } from "@/components/ui/text";
import { shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { supabase } from "@/lib/supabase";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bgColor = useColor("background");
  const sheetColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const primaryColor = useColor("primary");

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.replace("/(tabs)");
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: bgColor }]}
      edges={["top"]}
    >
      <StatusBar style="light" />

      <LoginHero />

      <View style={[styles.sheet, shadow.heroCard, { backgroundColor: sheetColor }]}>
        <View style={styles.sheetHeader}>
          <Text style={[styles.title, { color: textColor }]}>Buat Akun</Text>
          <Text style={[styles.subtitle, { color: textMutedColor }]}>
            Daftar untuk mulai mengelola keuangan
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={{ color: "#DC2626", fontSize: 13 }}>{error}</Text>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, { color: textColor, borderColor: textMutedColor + "40" }]}
          placeholder="Email"
          placeholderTextColor={textMutedColor}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TextInput
          style={[styles.input, { color: textColor, borderColor: textMutedColor + "40" }]}
          placeholder="Password"
          placeholderTextColor={textMutedColor}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")} style={styles.linkBtn}>
          <Text style={[styles.linkText, { color: textMutedColor }]}>
            Sudah punya akun?{" "}
            <Text style={{ color: primaryColor, fontFamily: "Poppins-Bold" }}>Masuk</Text>
          </Text>
        </TouchableOpacity>
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
  sheetHeader: { marginBottom: 24 },
  title: { ...typography.headlineLgMobile },
  subtitle: { ...typography.bodyLg, marginTop: 6 },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  linkBtn: {
    alignItems: "center",
    marginTop: 20,
  },
  linkText: {
    fontSize: 13,
  },
});
