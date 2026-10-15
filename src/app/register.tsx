import { LoginHero } from "@/components/features/login/login-hero";
import { Text } from "@/components/ui/text";
import { shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { supabase } from "@/lib/supabase";
import { syncAllStores } from "@/store/syncAllStores";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData?.session) {
      await syncAllStores();
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: bgColor }]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
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
            <Text style={{ color: "#DC2626", fontSize: 11 }}>{error}</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    marginTop: -20,
  },
  sheetHeader: { marginBottom: 16 },
  title: { ...typography.headlineLgMobile },
  subtitle: { ...typography.bodyLg, marginTop: 4 },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-Bold",
    fontSize: 12,
  },
  linkBtn: {
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    fontSize: 11,
  },
});
