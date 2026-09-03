import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { formatRupiah, type AiTransactionDraft } from "@/lib/ai";

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

  if (!draft) return null;

  const typeLabel =
    draft.transaction_type === "expense"
      ? "Pengeluaran"
      : draft.transaction_type === "income"
        ? "Pemasukan"
        : "Transfer";

  const isTransferMissingTarget =
    draft.transaction_type === "transfer" && !draft.to_account_id;
  const isCategoryMissing =
    draft.transaction_type !== "transfer" && !draft.category;
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
            Konfirmasi Transaksi
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>Tipe</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {typeLabel}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              Nominal
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {formatRupiah(draft.amount)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              Deskripsi
            </Text>
            <Text style={[styles.value, { color: textColor }]}>
              {draft.description}
            </Text>
          </View>

          {draft.transaction_type !== "transfer" && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: textMutedColor }]}>
                Kategori
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isCategoryMissing ? dangerColor : textColor },
                ]}
              >
                {draft.category?.category ??
                  "Tidak terdeteksi — batalkan & catat manual"}
              </Text>
            </View>
          )}

          {draft.transaction_type === "transfer" && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: textMutedColor }]}>
                Ke Akun
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: isTransferMissingTarget ? dangerColor : textColor },
                ]}
              >
                {draft.to_account_name ??
                  "Tidak terdeteksi — batalkan & catat manual"}
              </Text>
            </View>
          )}

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={onCancel}
              activeOpacity={0.85}
              disabled={saving}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>
                Batal
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
                {saving ? "Menyimpan..." : "Simpan"}
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
