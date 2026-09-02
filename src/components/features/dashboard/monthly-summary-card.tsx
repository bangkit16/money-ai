import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type MonthlySummaryCardProps = {
  income: number;
  expense: number;
  incomeBarWidth: number;
  expenseBarWidth: number;
  monthLabel?: string;
};

export function MonthlySummaryCard({
  income,
  expense,
  incomeBarWidth,
  expenseBarWidth,
  monthLabel,
}: MonthlySummaryCardProps) {
  const { formatCurrency } = useFormatCurrency();
  const cardColor = useColor("card");
  const onSecondaryContainerColor = useColor("onSecondaryContainer");
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const onSurfaceColor = useColor("onSurface");
  const outlineColor = useColor("outline");
  const outlineVariantColor = useColor("outlineVariant");
  const primaryColor = useColor("primary");
  const errorColor = useColor("error");
  const tertiaryFixedDimColor = useColor("tertiaryFixedDim");
  const surfaceContainerColor = useColor("surfaceContainer");
  return (
    <View style={[styles.card, shadow.card, styles.summaryCard, { backgroundColor: cardColor }]}>
      <View style={styles.summaryCol}>
        <View style={styles.summaryLabelRow}>
          <MaterialIcons
            name="arrow-downward"
            size={18}
            color={onSecondaryContainerColor}
          />
          <Text style={[styles.summaryLabel, { color: onSurfaceVariantColor }]}>INCOME</Text>
        </View>
        <Text style={[styles.summaryAmount, { color: onSurfaceColor }]}>{formatCurrency(income)}</Text>
        <View style={[styles.progressTrack, { backgroundColor: surfaceContainerColor }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${incomeBarWidth}%`,
                backgroundColor: primaryColor,
              },
            ]}
          />
        </View>
        {monthLabel ? (
          <Text style={[styles.monthLabel, { color: outlineColor }]}>{monthLabel}</Text>
        ) : null}
      </View>
      <View style={[styles.summaryCol, { borderLeftColor: outlineVariantColor, borderLeftWidth: 1, paddingLeft: 24, marginLeft: 8 }]}>
        <View style={styles.summaryLabelRow}>
          <MaterialIcons name="arrow-upward" size={18} color={errorColor} />
          <Text style={[styles.summaryLabel, { color: onSurfaceVariantColor }]}>EXPENSES</Text>
        </View>
        <Text style={[styles.summaryAmount, { color: onSurfaceColor }]}>{formatCurrency(expense)}</Text>
        <View style={[styles.progressTrack, { backgroundColor: surfaceContainerColor }]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${expenseBarWidth}%`,
                backgroundColor: tertiaryFixedDimColor,
              },
            ]}
          />
        </View>
        {monthLabel ? (
          <Text style={[styles.monthLabel, { color: outlineColor }]}>{monthLabel}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 24 },
  summaryCard: { flexDirection: "row" },
  summaryCol: { flex: 1, gap: 16 },
  summaryLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryLabel: { ...typography.labelCaps },
  summaryAmount: { ...typography.headlineLgMobile },
  monthLabel: {
    ...typography.labelCaps,
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: radius.full },
});
