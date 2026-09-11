import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { formatRupiah, type AiUpdatePayload } from "@/lib/ai";
import { useT } from "@/i18n";

type Props = {
  visible: boolean;
  payload: AiUpdatePayload | null;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
};

export default function AiUpdateConfirmModal({
  visible,
  payload,
  onCancel,
  onConfirm,
  saving,
}: Props) {
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const whiteColor = useColor("background");
  const dangerColor = "#e0483a";
  const t = useT();

  if (!payload) return null;

  const { before, changes } = payload;
  const hasChanges = Object.keys(changes).length > 0;

  const getTypeLabel = (type: string) =>
    type === "EXPENSE"
      ? t("type.expense")
      : type === "INCOME"
        ? t("type.income")
        : t("type.transfer");

  const renderChangeRow = (
    label: string,
    oldValue: string | null,
    newValue: string | null,
  ) => {
    if (newValue === null) return null;
    return (
      <View style={styles.changeRow}>
        <Text style={[styles.changeLabel, { color: textMutedColor }]}>{label}</Text>
        <View style={styles.changeValues}>
          {oldValue && (
            <Text style={[styles.oldValue, { color: textMutedColor }]}>
              {oldValue}
            </Text>
          )}
          <Text style={[styles.arrow, { color: textMutedColor }]}>→</Text>
          <Text style={[styles.newValue, { color: textColor }]}>
            {newValue}
          </Text>
        </View>
      </View>
    );
  };

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
          <Text style={[styles.title, { color: textColor }]}>
            {t("ai.updateTitle")}
          </Text>

          <Text style={[styles.message, { color: textColor }]}>
            {t("ai.updateMessage")}
          </Text>

          {!hasChanges ? (
            <Text style={[styles.noChanges, { color: textMutedColor }]}>
              {t("ai.noChanges")}
            </Text>
          ) : (
            <>
              {renderChangeRow(
                t("confirm.type"),
                before.transaction_type,
                changes.transaction_type ? getTypeLabel(changes.transaction_type) : null,
              )}
              {renderChangeRow(
                t("confirm.nominal"),
                formatRupiah(before.amount),
                changes.amount ? formatRupiah(changes.amount) : null,
              )}
              {renderChangeRow(
                t("confirm.description"),
                before.transaction,
                changes.transaction ?? null,
              )}
              {renderChangeRow(
                t("add.category"),
                before.category?.category ?? "-",
                changes.category?.category ?? null,
              )}
            </>
          )}

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
              style={[
                styles.button,
                { backgroundColor: hasChanges ? primaryColor : borderColor },
              ]}
              onPress={onConfirm}
              disabled={!hasChanges || saving}
              activeOpacity={0.85}
            >
              <Text style={[styles.buttonText, { color: whiteColor }]}>
                {saving ? t("add.loading") : t("common.save")}
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
  noChanges: { ...typography.bodyLg, textAlign: "center", marginVertical: 8 },
  changeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  changeLabel: { fontSize: 11, minWidth: 70 },
  changeValues: { flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 1 },
  oldValue: { fontSize: 11, textDecorationLine: "line-through" },
  arrow: { fontSize: 12 },
  newValue: { fontSize: 12, fontWeight: "600" },
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
