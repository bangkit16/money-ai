import { formatCurrency } from "@/utils/formatCurrency";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type MonthlySummaryCardProps = {
  income: number;
  expense: number;
  incomeBarWidth: number;
  expenseBarWidth: number;
};

export function MonthlySummaryCard({
  income,
  expense,
  incomeBarWidth,
  expenseBarWidth,
}: MonthlySummaryCardProps) {
  return (
    <View style={[styles.card, shadow.card, styles.summaryCard]}>
      <View style={styles.summaryCol}>
        <View style={styles.summaryLabelRow}>
          <MaterialIcons
            name="arrow-downward"
            size={18}
            color={colors.onSecondaryContainer}
          />
          <Text style={styles.summaryLabel}>INCOME</Text>
        </View>
        <Text style={styles.summaryAmount}>{formatCurrency(income)}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${incomeBarWidth}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      </View>
      <View style={[styles.summaryCol, styles.summaryColBorder]}>
        <View style={styles.summaryLabelRow}>
          <MaterialIcons name="arrow-upward" size={18} color={colors.error} />
          <Text style={styles.summaryLabel}>EXPENSES</Text>
        </View>
        <Text style={styles.summaryAmount}>{formatCurrency(expense)}</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${expenseBarWidth}%`,
                backgroundColor: colors.tertiaryFixedDim,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  summaryCard: { flexDirection: "row" },
  summaryCol: { flex: 1, gap: 16 },
  summaryColBorder: {
    borderLeftWidth: 1,
    borderLeftColor: colors.outlineVariant,
    paddingLeft: 24,
    marginLeft: 8,
  },
  summaryLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  summaryLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  summaryAmount: { ...typography.headlineLgMobile, color: colors.onSurface },
  progressTrack: {
    height: 4,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: radius.full },
});
