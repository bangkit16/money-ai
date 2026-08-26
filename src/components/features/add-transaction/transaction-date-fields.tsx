import DateTimeField from "@/components/DateTimeField";
import { Text } from "@/components/ui/text";
import { colors, radius, spacing, typography } from "@/constants/theme";
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
  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <View style={[styles.fieldBlock, { flex: 3 }]}>
          <Text style={styles.label}>Transaction</Text>
          <TextInput
            value={transaction}
            onChangeText={onChangeTransaction}
            placeholder="What was this for?"
            placeholderTextColor={colors.outline}
            style={styles.inputSoft}
          />
        </View>
        <View style={[styles.fieldBlock, { flex: 2 }]}>
          <Text style={styles.label}>Date & Time</Text>
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
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  inputSoft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
