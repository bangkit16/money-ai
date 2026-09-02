import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, typography } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type TopAccount = { name: string; balance: number };

type HeroBalanceCardProps = {
  netWorth: number;
  trendPct: number;
  topAccounts: TopAccount[];
};

export function HeroBalanceCard({
  netWorth,
  trendPct,
  topAccounts,
}: HeroBalanceCardProps) {
  const { formatCurrencySigned } = useFormatCurrency();
  // const primaryColor = useColor("primary");
  const primaryContainerColor = useColor("primaryContainer");
  const tertiaryFixedColor = useColor("tertiaryFixed");
  const whiteColor = useColor("white");
  return (
    <LinearGradient
      colors={["#0a2505", "#253b21"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, shadow.heroCard]}
    >
      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.heroLabel}>TOTAL BALANCE</Text>
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
        {topAccounts.length > 0 ? (
          topAccounts.map((acc) => (
            <View key={acc.name}>
              <Text style={styles.heroSubLabel}>{acc.name.toUpperCase()}</Text>
              <Text style={[styles.heroSubAmount, { color: whiteColor }]}>
                {formatCurrencySigned(acc.balance)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.heroSubLabel}>Belum ada rekening</Text>
        )}
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
  heroSubAmount: { ...typography.titleMd, marginTop: 4 },
});
