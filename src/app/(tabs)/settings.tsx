import { LogoutButton } from "@/components/features/settings/logout-button";
import { LogoutConfirmModal } from "@/components/features/settings/logout-confirm-modal";
import { Text } from "@/components/ui/text";
import { colors, spacing, typography } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setConfirmVisible(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>Settings</Text>
      </View>

      <View style={styles.body}>
        <LogoutButton onPress={() => setConfirmVisible(true)} />
      </View>

      <LogoutConfirmModal
        visible={confirmVisible}
        isLoggingOut={isLoggingOut}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
  },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  body: { flex: 1, padding: spacing.marginMobile },
});
