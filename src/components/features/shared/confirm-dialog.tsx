import { Text } from "@/components/ui/text";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  isConfirming?: boolean;
};

// Dialog tengah layar — dipakai untuk konfirmasi hapus & pesan error
// (pengganti Alert.alert yang tidak render di web)
export function ConfirmDialog({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = "OK",
  isConfirming = false,
}: ConfirmDialogProps) {
  const hasConfirmAction = !!onConfirm;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centerOverlay}>
        <View style={[styles.confirmCard, shadow.heroCard]}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.confirmText}>{message}</Text>
          <View style={styles.modalActions}>
            {hasConfirmAction ? (
              <>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isConfirming}
                >
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={onConfirm!}
                  disabled={isConfirming}
                >
                  <Text style={styles.saveButtonText}>
                    {isConfirming ? "..." : confirmLabel}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, { marginTop: 8 }]}
                onPress={onClose}
              >
                <Text style={styles.saveButtonText}>{confirmLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centerOverlay: {
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
  modalTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  confirmText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
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
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { ...typography.titleMd, fontSize: 15, color: colors.white },
});
