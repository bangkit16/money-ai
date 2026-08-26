import { formatCurrency } from "@/utils/formatCurrency";
import { DonutChart } from "@/components/features/analytics/donut-chart";
import type { DonutSegment } from "@/components/features/analytics/donut-chart";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

// TODO: ganti dummy data ini dengan data asli (state/API)
const donutSegments: DonutSegment[] = [
  { label: "Rent (40%)", value: 40, color: colors.primary },
  { label: "Food (25%)", value: 25, color: colors.secondary },
  { label: "Transport (20%)", value: 20, color: colors.tertiaryFixedDim },
  { label: "Other (15%)", value: 15, color: colors.secondaryContainer },
];

const totalSpend = 4280;

export function SpendingStructureCard() {
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
        <DonutChart segments={donutSegments} />
        <View style={styles.donutCenter}>
          <Text style={styles.mutedLabel}>TOTAL</Text>
          <Text style={styles.donutTotal}>{formatCurrency(totalSpend)}</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {donutSegments.map((seg) => (
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
