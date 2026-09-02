// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const errorColor = useColor("destructive");
  const whiteColor = useColor("background");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.confirmCard, shadow.heroCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.confirmTitle, { color: textColor }]}>Log Out</Text>
          <Text style={[styles.confirmText, { color: textMutedColor }]}>
            Yakin ingin keluar dari akun kamu?
          </Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor }]}
              onPress={onClose}
              disabled={isLoggingOut}
            >
              <Text style={[styles.cancelButtonText, { color: textMutedColor }]}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmLogoutButton, { backgroundColor: errorColor }]}
              onPress={onConfirm}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator color={whiteColor} />
              ) : (
                <Text style={[styles.confirmLogoutText, { color: whiteColor }]}>Log Out</Text>
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
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
  confirmTitle: { ...typography.titleMd },
  confirmText: {
    ...typography.bodyLg,
    lineHeight: 22,
  },
  confirmActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    ...typography.titleMd,
    fontSize: 15,
  },
  confirmLogoutButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmLogoutText: {
    ...typography.titleMd,
    fontSize: 15,
  },
});