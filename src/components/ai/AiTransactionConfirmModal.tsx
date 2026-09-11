import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { formatRupiah, type AiTransactionItem } from "@/lib/ai";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";

type Props = {
  visible: boolean;
  /** Single transaction (legacy). */
  draft?: AiTransactionItem | null;
  /** Multiple transactions. */
  items?: AiTransactionItem[];
  onCancel: () => void;
  onConfirm: () => void;
  /** Called for each item when items is used. */
  onConfirmItem?: (item: AiTransactionItem) => void;
  saving?: boolean;
};

export default function AiTransactionConfirmModal({
  visible,
  draft,
  items,
  onCancel,
  onConfirm,
  onConfirmItem,
  saving,
}: Props) {
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const mutedColor = useColor("muted");
  const whiteColor = useColor("background");
  const dangerColor = "#e0483a";
  const t = useT();
  const { language } = useSettings();

  const list = items && items.length > 0 ? items : draft ? [draft] : [];

  if (list.length === 0) return null;

  const isMultiple = list.length > 1;

  // Normalize transaction_type — Gemini bisa return "Transfer", "transfer", "TRANSFER", dll.
  const normalizeType = (v: string) => v?.toUpperCase() ?? "";

  const getTypeLabel = (type: string) => {
    const n = normalizeType(type);
    return n === "EXPENSE"
      ? t("type.expense")
      : n === "INCOME"
        ? t("type.income")
        : t("type.transfer");
  };

  const isTransfer = (type: string) => normalizeType(type) === "TRANSFER";

  const renderSingle = (d: AiTransactionItem) => {
    const typeLabel = getTypeLabel(d.transaction_type);
    const isTransferMissingTarget = isTransfer(d.transaction_type) && !d.to_account_id;
    const isCategoryMissing = !isTransfer(d.transaction_type) && !d.category;
    const canConfirm = !isTransferMissingTarget && !isCategoryMissing;

    return (
      <>
        <View style={styles.row}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("confirm.type")}
          </Text>
          <Text style={[styles.value, { color: textColor }]}>{typeLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("confirm.nominal")}
          </Text>
          <Text style={[styles.value, { color: textColor }]}>
            {formatRupiah(d.amount)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("confirm.description")}
          </Text>
          <Text style={[styles.value, { color: textColor }]}>
            {d.description}
          </Text>
        </View>

        {!isTransfer(d.transaction_type) && (
          <>
            {d.account_id && (
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
                  {d.account_name ?? t("confirm.notDetected")}
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
                {d.category
                  ? language === "en"
                    ? (d.category.category_en ?? d.category.category)
                    : d.category.category
                  : t("confirm.notDetected")}
              </Text>
            </View>
          </>
        )}

        {isTransfer(d.transaction_type) && (
          <>
            <View style={styles.row}>
              <Text style={[styles.label, { color: textMutedColor }]}>
                {t("confirm.fromAccount")}
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isTransferMissingTarget ? dangerColor : textColor },
                ]}
              >
                {d.account_name ?? t("confirm.notDetected")}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: textMutedColor }]}>
                {t("confirm.toAccount")}
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isTransferMissingTarget ? dangerColor : textColor },
                ]}
              >
                {d.to_account_name ?? t("confirm.notDetected")}
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
      </>
    );
  };

  const renderMultiple = () => (
    <>
      <ScrollView style={{ maxHeight: 400 }} nestedScrollEnabled>
        <View style={{ gap: 12 }}>
          {list.map((item, idx) => {
            const typeLabel = getTypeLabel(item.transaction_type);
            const isTransferMissingTarget = isTransfer(item.transaction_type) && !item.to_account_id;
            const isCategoryMissing = !isTransfer(item.transaction_type) && !item.category;
            const canConfirm = !isTransferMissingTarget && !isCategoryMissing;

            return (
              <View
                key={idx}
                style={[styles.multiItem, { backgroundColor: mutedColor }]}
              >
                {/* Header: deskripsi + nominal */}
                <View style={styles.multiHeader}>
                  <Text style={[styles.multiDesc, { color: textColor }]}>{item.description}</Text>
                  <Text style={[styles.multiAmount, { color: normalizeType(item.transaction_type) === "INCOME" ? "#16a34a" : textColor }]}>
                    {normalizeType(item.transaction_type) === "INCOME" ? "+" : "-"}{formatRupiah(item.amount)}
                  </Text>
                </View>

                {/* Detail rows — persis seperti single */}
                <View style={styles.multiDetails}>
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.type")}</Text>
                    <Text style={[styles.value, { color: textColor }]}>{typeLabel}</Text>
                  </View>

                  {!isTransfer(item.transaction_type) && (
                    <>
                      {item.account_id && (
                        <View style={styles.row}>
                          <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.savedIn")}</Text>
                          <Text style={[styles.value, { color: isCategoryMissing ? dangerColor : textColor }]}>
                            {item.account_name ?? t("confirm.notDetected")}
                          </Text>
                        </View>
                      )}
                      <View style={styles.row}>
                        <Text style={[styles.label, { color: textMutedColor }]}>{t("add.category")}</Text>
                        <Text style={[styles.value, { color: isCategoryMissing ? dangerColor : textColor }]}>
                          {item.category
                            ? language === "en"
                              ? item.category.category_en ?? item.category.category
                              : item.category.category
                            : t("confirm.notDetected")}
                        </Text>
                      </View>
                    </>
                  )}

                  {isTransfer(item.transaction_type) && (
                    <>
                      <View style={styles.row}>
                        <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.fromAccount")}</Text>
                        <Text style={[styles.value, { color: isTransferMissingTarget ? dangerColor : textColor }]}>
                          {item.account_name ?? t("confirm.notDetected")}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={[styles.label, { color: textMutedColor }]}>{t("confirm.toAccount")}</Text>
                        <Text style={[styles.value, { color: isTransferMissingTarget ? dangerColor : textColor }]}>
                          {item.to_account_name ?? t("confirm.notDetected")}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Simpan per item */}
                <TouchableOpacity
                  style={[
                    styles.multiSaveBtn,
                    { backgroundColor: canConfirm ? primaryColor : borderColor },
                  ]}
                  onPress={() => onConfirmItem?.(item)}
                  disabled={!canConfirm || saving}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.multiSaveBtnText, { color: whiteColor }]}>
                    {t("common.save")}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { borderColor }]}
          onPress={onCancel}
          activeOpacity={0.85}
          disabled={saving}
        >
          <Text style={[styles.buttonText, { color: textColor }]}>{t("common.cancel")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: primaryColor }]}
          onPress={onConfirm}
          activeOpacity={0.85}
          disabled={saving}
        >
          <Text style={[styles.buttonText, { color: whiteColor }]}>
            {saving ? t("add.loading") : t("common.save")} Semua
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, shadow.heroCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.title, { color: textColor }]}>
            {isMultiple ? `${list.length} Transaksi` : t("confirm.title")}
          </Text>
          {isMultiple ? renderMultiple() : renderSingle(list[0])}
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
  // multiple items
  multiItem: {
    borderRadius: radius.lg,
    padding: 12,
    gap: 6,
  },
  multiHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  multiDesc: { fontSize: 12, fontWeight: "700", flex: 1 },
  multiAmount: { fontSize: 12, fontWeight: "700" },
  multiDetails: { gap: 4 },
  multiSaveBtn: {
    height: 34,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  multiSaveBtnText: { fontSize: 11, fontWeight: "600" },
});
