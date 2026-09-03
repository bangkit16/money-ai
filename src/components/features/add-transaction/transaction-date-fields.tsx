// migrated to useColor
import DateTimeField from "@/components/DateTimeField";
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

// Transaction & Date/Time — fixed satu baris, selalu terlihat di atas numpad
export function TransactionDateFields({
  transaction,
  onChangeTransaction,
  dateTime,
  onChangeDateTime,
}: TransactionDateFieldsProps) {
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const cardColor = useColor("card");
  const t = useT();
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
              ,
              { backgroundColor: cardColor, borderColor },
              styles.inputSoft,
            ]}
          />
        </View>
        <View style={[styles.fieldBlock, { flex: 2 }]}>
          <Text style={[styles.label, { color: textMutedColor }]}>
            {t("add.dateTimeLabel")}
          </Text>
          <DateTimeField value={dateTime} onChange={onChangeDateTime} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 8,
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
