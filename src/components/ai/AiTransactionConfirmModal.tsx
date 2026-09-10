import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { formatRupiah, type AiTransactionDraft } from "@/lib/ai";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";

type Props = {
  visible: boolean;
  draft: AiTransactionDraft | null;
  onCancel: () => void;
  onConfirm: () => void;
  saving?: boolean;
};

export default function AiTransactionConfirmModal({
  visible,
  draft,
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
  const { language } = useSettings();

  if (!draft) return null;

  const typeLabel =
    draft.transaction_type === "EXPENSE"
      ? t("type.expense")
      : draft.transaction_type === "INCOME"
        ? t("type.income")
        : t("type.transfer");

  const isTransferMissingTarget =
    draft.transaction_type === "TRANSFER" && !draft.to_account_id;
  const isCategoryMissing =
    draft.transaction_type !== "TRANSFER" && !draft.category;
  const canConfirm = !isTransferMissingTarget && !isCategoryMissing;

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
            {t("confirm.title")}
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.type")}</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {typeLabel}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              {t("confirm.nominal")}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {formatRupiah(draft.amount)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              {t("confirm.description")}
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {draft.description}
            </Text>
          </View>

          {draft.transaction_type !== "TRANSFER" && (
            <>
              {draft.account_id && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: textMutedColor }]}>
                    {t("confirm.savedIn")}
                  </Text>
                  <Text
                    style={[
                      styles.value,
                      { color: isCategoryMissing ? dangerColor : textColor },
                    ]}
                  >
                    {draft.account_name ??
                      t("confirm.notDetected")}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={[styles.label, { color: textMutedColor }]}>
                  {t("add.category")}
                </Text>
                <Text
                  style={[
                    styles.value,
                    { color: isCategoryMissing ? dangerColor : textColor },
                  ]}
                >
                  {draft.category
                    ? language === "en"
                      ? draft.category.category_en ?? draft.category.category
                      : draft.category.category
                    : t("confirm.notDetected")}
                </Text>
              </View>
            </>
          )}

          {draft.transaction_type === "TRANSFER" && (
            <>
              <View style={styles.row}>
                <Text style={[styles.label, { color: textMutedColor }]}>
                  {t("confirm.fromAccount")}
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: isTransferMissingTarget ? dangerColor : textColor,
                    },
                  ]}
                >
                  {draft.account_name ??
                    t("confirm.notDetected")}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: textMutedColor }]}>
                  {t("confirm.toAccount")}
                </Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color: isTransferMissingTarget ? dangerColor : textColor,
                    },
                  ]}
                >
                  {draft.to_account_name ??
                    t("confirm.notDetected")}
                </Text>
              </View>
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
                { backgroundColor: canConfirm ? primaryColor : borderColor },
              ]}
              onPress={onConfirm}
              disabled={!canConfirm || saving}
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
  title: { ...typography.titleMd, fontSize: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  label: { fontSize: 13 },
  value: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right" },
  footerRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  button: {
    flex: 1,
    height: 46,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: { borderWidth: 1.5 },
  buttonText: { fontSize: 14, fontWeight: "600" },
});
