import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { radius, shadow, typography } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type HeroBalanceCardProps = {
  netWorth: number;
  trendPct: number;
  prevMonthNet: number;
};

export function HeroBalanceCard({
  netWorth,
  trendPct,
  prevMonthNet,
}: HeroBalanceCardProps) {
  const { formatCurrencySigned } = useFormatCurrency();
  const t = useT();
  const tertiaryFixedColor = useColor("tertiaryFixed");
  const whiteColor = useColor("white");
  const successColor = useColor("successGreen");
  const dangerColor = useColor("error");
  const isPositive = prevMonthNet >= 0;
  const prevMonthColor = isPositive ? successColor : dangerColor;
  return (
    <LinearGradient
      colors={["#0a2505", "#253b21"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, shadow.heroCard]}
    >
      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.heroLabel}>{t("dashboard.totalBalance")}</Text>
          <Text style={[styles.heroAmount, { color: whiteColor }]}>
            {formatCurrencySigned(netWorth)}
          </Text>
        </View>
        <View style={styles.trendBadge}>
          <MaterialIcons
            name={trendPct >= 0 ? "trending-up" : "trending-down"}
            size={16}
            color={tertiaryFixedColor}
          />
          <Text style={[styles.trendBadgeText, { color: tertiaryFixedColor }]}>
            {trendPct >= 0 ? "+" : ""}
            {trendPct.toFixed(1)}%
          </Text>
        </View>
      </View>
      <View style={styles.heroSubRow}>
        <View>
          <Text style={styles.heroSubLabel}>{t("dashboard.prevMonthTotal")}</Text>
          <View style={styles.heroSubAmountRow}>
            <MaterialIcons
              name={isPositive ? "arrow-upward" : "arrow-downward"}
              size={20}
              color={prevMonthColor}
            />
            <Text style={[styles.heroSubAmount, { color: prevMonthColor }]}>
              {formatCurrencySigned(prevMonthNet)}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  heroCard: { borderRadius: radius.xl, padding: 24 },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.7)" },
  heroAmount: { ...typography.displayLg, marginTop: 4 },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(162,137,99,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  trendBadgeText: { ...typography.labelCaps },
  heroSubRow: { flexDirection: "row", gap: 48, marginTop: 24 },
  heroSubLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.6)" },
  heroSubAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  heroSubAmount: { ...typography.titleMd },
});
