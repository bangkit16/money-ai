// migrated to useColor
import { DateField, TimeField } from "@/components/DateTimeField";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { StyleSheet, TextInput, View } from "react-native";

type TransactionDateFieldsProps = {
  transaction: string;
  onChangeTransaction: (text: string) => void;
  dateTime: Date;
  onChangeDateTime: (date: Date) => void;
};

// Transaction + Tanggal/Waktu — fixed satu baris, selalu terlihat di atas numpad.
// Tanggal & waktu dipisah agar pemilihan jam eksplisit, bukan tersembunyi di alur "Next".
export function TransactionDateFields({
  transaction,
  onChangeTransaction,
  dateTime,
  onChangeDateTime,
}: TransactionDateFieldsProps) {
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const t = useT();

  const toDateOnly = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const setTimePart = (date: Date) => {
    // Gabungkan bagian jam dari picker waktu dengan tanggal yang sudah dipilih
    const combined = new Date(toDateOnly(dateTime));
    combined.setHours(date.getHours(), date.getMinutes(), 0, 0);
    onChangeDateTime(combined);
  };

  const setDatePart = (date: Date) => {
    // Pertahankan jam yang sudah dipilih saat mengganti tanggal
    const combined = new Date(toDateOnly(date));
    combined.setHours(dateTime.getHours(), dateTime.getMinutes(), 0, 0);
    onChangeDateTime(combined);
  };

  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <View style={[styles.fieldBlock, { flex: 3 }]}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("add.transactionLabel")}
          </Text>
          <TextInput
            value={transaction}
            onChangeText={onChangeTransaction}
            placeholder={t("add.transactionPlaceholder")}
            placeholderTextColor={textMutedColor}
            style={[
              { backgroundColor: cardColor, borderColor, color: textColor },
              styles.inputSoft,
            ]}
          />
        </View>
        <View style={[styles.fieldBlock, { flex: 2 }]}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("add.dateLabel")}
          </Text>
          <DateField value={dateTime} onChange={setDatePart} />
        </View>
        <View style={[styles.fieldBlock, { flex: 2 }]}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("add.timeLabel")}
          </Text>
          <TimeField value={dateTime} onChange={setTimePart} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  fieldBlock: {},
  label: {
    ...typography.labelCaps,
    marginBottom: 8,
  },
  inputSoft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
