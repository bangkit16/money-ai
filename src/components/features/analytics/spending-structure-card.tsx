import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useColor } from "@/hooks/useColor";
import { DonutChart } from "@/components/features/analytics/donut-chart";
import type { DonutSegment } from "@/components/features/analytics/donut-chart";
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

type Props = {
  segments: DonutSegment[];
  totalSpend: number;
};

export function SpendingStructureCard({ segments, totalSpend }: Props) {
  const { formatCurrency } = useFormatCurrency();
  const cardColor = useColor("card");
  const onSurfaceColor = useColor("onSurface");
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const primaryColor = useColor("primary");
  return (
    <View style={[styles.card, shadow.card, { alignItems: "center", backgroundColor: cardColor }]}>
      <Text style={[styles.titleMd, { alignSelf: "flex-start", marginBottom: 16, color: onSurfaceColor }]}>
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
          <Text style={[styles.mutedLabel, { color: onSurfaceVariantColor }]}>TOTAL</Text>
          <Text style={[styles.donutTotal, { color: primaryColor }]}>{formatCurrency(totalSpend)}</Text>
        </View>
      </View>
      <View style={styles.legendGrid}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: seg.color }]}
            />
            <Text style={[styles.legendText, { color: onSurfaceVariantColor }]}>{seg.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 24 },
  titleMd: { ...typography.titleMd },
  mutedLabel: { ...typography.labelCaps },

  donutCenter: { position: "absolute", alignItems: "center" },
  donutTotal: { ...typography.headlineLgMobile },

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
  legendText: { ...typography.bodySm },
});
