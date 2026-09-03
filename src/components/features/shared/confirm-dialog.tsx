// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
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

  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const errorColor = useColor("destructive");
  const primaryColor = useColor("primary");
  const whiteColor = useColor("card");
  const t = useT();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centerOverlay}>
        <View style={[styles.confirmCard, shadow.heroCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.confirmText, { color: textMutedColor }]}>{message}</Text>
          <View style={styles.modalActions}>
            {hasConfirmAction ? (
              <>
                <TouchableOpacity
                  style={[styles.cancelButton, { borderColor }]}
                  onPress={onClose}
                  disabled={isConfirming}
                >
                  <Text style={[styles.cancelButtonText, { color: textMutedColor }]}>{t("common.cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: errorColor }]}
                  onPress={onConfirm!}
                  disabled={isConfirming}
                >
                  <Text style={[styles.saveButtonText, { color: whiteColor }]}>
                    {isConfirming ? "..." : confirmLabel}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: primaryColor, marginTop: 8 }]}
                onPress={onClose}
              >
                <Text style={[styles.saveButtonText, { color: whiteColor }]}>{confirmLabel}</Text>
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
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    ...typography.titleMd,
    marginBottom: 4,
  },
  confirmText: {
    ...typography.bodyLg,
    lineHeight: 22,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
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
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: { ...typography.titleMd, fontSize: 15 },
});