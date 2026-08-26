import { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "../../constants/theme";
import { Text } from "@/components/ui/text";
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
        <TouchableOpacity
          style={[styles.logoutButton, shadow.card]}
          onPress={() => setConfirmVisible(true)}
          activeOpacity={0.85}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Konfirmasi logout */}
      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={[styles.confirmCard, shadow.heroCard]}>
            <Text style={styles.confirmTitle}>Log Out</Text>
            <Text style={styles.confirmText}>
              Yakin ingin keluar dari akun kamu?
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmVisible(false)}
                disabled={isLoggingOut}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.confirmLogoutText}>Log Out</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  logoutText: { ...typography.titleMd, fontSize: 15, color: colors.error },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,17,37,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.marginMobile,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
  confirmTitle: { ...typography.titleMd, color: colors.onSurface },
  confirmText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  confirmActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  confirmLogoutButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmLogoutText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.white,
  },
});
