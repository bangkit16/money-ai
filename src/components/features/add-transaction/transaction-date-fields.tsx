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

// Transaction + Tanggal/Waktu — dua baris: baris pertama transaction, baris kedua tanggal dan waktu
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
        <View style={[styles.fieldBlock, { flex: 1 }]}>
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
      </View>
      <View style={styles.row}>
        <View style={[styles.fieldBlock, { flex: 1 }]}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("add.dateLabel")}
          </Text>
          <DateField value={dateTime} onChange={setDatePart} />
        </View>
        <View style={[styles.fieldBlock, { flex: 1 }]}>
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
    gap: 2,
    flexDirection: "column",
  },
  row: { flexDirection: "row", gap: 6, marginBottom: 8 },
  fieldBlock: {},
  label: {
    ...typography.labelCaps,
    marginBottom: 4,
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
