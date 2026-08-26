import { Text } from "@/components/ui/text";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type LogoutConfirmModalProps = {
  visible: boolean;
  isLoggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmModal({
  visible,
  isLoggingOut,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
              onPress={onClose}
              disabled={isLoggingOut}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmLogoutButton}
              onPress={onConfirm}
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
  );
}

const styles = StyleSheet.create({
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
