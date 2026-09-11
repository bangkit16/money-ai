import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { formatRupiah, type AiDeleteTarget } from "@/lib/ai";
import { useT } from "@/i18n";

type Props = {
  visible: boolean;
  target: AiDeleteTarget | null;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
};

export default function AiDeleteConfirmModal({
  visible,
  target,
  onCancel,
  onConfirm,
  saving,
}: Props) {
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const dangerColor = "#e0483a";
  const whiteColor = useColor("background");
  const t = useT();

  if (!target) return null;

  const typeLabel =
    target.transaction_type === "EXPENSE"
      ? t("type.expense")
      : target.transaction_type === "INCOME"
        ? t("type.income")
        : t("type.transfer");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.card, shadow.heroCard, { backgroundColor: cardColor }]}
        >
          <Text style={[styles.title, { color: dangerColor }]}>
            {t("ai.deleteTitle")}
          </Text>

          <Text style={[styles.message, { color: textColor }]}>
            {t("ai.deleteMessage")}
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.type")}</Text>
            <Text style={[styles.value, { color: textColor }]}>{typeLabel}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.nominal")}</Text>
            <Text style={[styles.value, { color: textColor }]}>{formatRupiah(target.amount)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.description")}</Text>
            <Text style={[styles.value, { color: textColor }]}>{target.transaction}</Text>
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={onCancel}
              activeOpacity={0.85}
              disabled={saving}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: dangerColor }]}
              onPress={onConfirm}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text style={[styles.buttonText, { color: whiteColor }]}>
                {saving ? t("add.loading") : t("common.delete")}
              </Text>
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
    padding: spacing.marginMobile,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: radius.xl,
    padding: 20,
    gap: 14,
  },
  title: { ...typography.titleMd, fontSize: 14 },
  message: { ...typography.bodyLg, marginBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  label: { fontSize: 11 },
  value: { fontSize: 12, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  footerRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  button: {
    flex: 1,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { borderWidth: 1.5 },
  buttonText: { fontSize: 12, fontWeight: "600" },
});
