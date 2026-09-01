import { formatCurrency } from "@/utils/formatCurrency";
import { DonutChart } from "@/components/features/analytics/donut-chart";
import type { DonutSegment } from "@/components/features/analytics/donut-chart";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

type Props = {
  segments: DonutSegment[];
  totalSpend: number;
};

export function SpendingStructureCard({ segments, totalSpend }: Props) {
  return (
    <View style={[styles.card, shadow.card, { alignItems: "center" }]}>
      <Text style={[styles.titleMd, { alignSelf: "flex-start", marginBottom: 16 }]}>
        Spending Structure
      </Text>
      <View
        style={{
          width: 200,
          height: 200,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DonutChart segments={segments} />
        <View style={styles.donutCenter}>
          <Text style={styles.mutedLabel}>TOTAL</Text>
          <Text style={styles.donutTotal}>{formatCurrency(totalSpend)}</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: seg.color }]}
            />
            <Text style={styles.legendText}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  titleMd: { ...typography.titleMd, color: colors.onSurface },
  mutedLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },

  donutCenter: { position: "absolute", alignItems: "center" },
  donutTotal: { ...typography.headlineLgMobile, color: colors.primary },

  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 24,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "45%",
  },
  legendDot: { width: 10, height: 10, borderRadius: radius.full },
  legendText: { ...typography.bodySm, color: colors.onSurfaceVariant },
});