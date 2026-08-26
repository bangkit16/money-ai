import { Text } from "@/components/ui/text";
import { colors, typography } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export function AmountDisplay({ amount }: { amount: string }) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.row}>
        <Text style={styles.currencySymbol}>Rp</Text>
        <Text style={styles.value}>{amount.length > 0 ? amount : "0"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { alignItems: "center", paddingVertical: 4 },
  label: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginRight: 4,
  },
  value: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.primary,
    maxWidth: "100%",
  },
});
