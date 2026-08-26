import { formatCurrency, formatCurrencySigned } from "@/utils/formatCurrency";
import { colors, radius, shadow, typography } from "@/constants/theme";
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
  console.log("topAccounts", netWorth);
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.heroCard, shadow.heroCard]}
    >
      <View style={styles.heroTopRow}>
        <View>
          <Text style={styles.heroLabel}>TOTAL BALANCE</Text>
          <Text style={styles.heroAmount}>{formatCurrencySigned(netWorth)}</Text>
        </View>
        <View style={styles.trendBadge}>
          <MaterialIcons
            name={trendPct >= 0 ? "trending-up" : "trending-down"}
            size={16}
            color={colors.tertiaryFixed}
          />
          <Text style={styles.trendBadgeText}>
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
              <Text style={styles.heroSubAmount}>
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
  heroAmount: { ...typography.displayLg, color: colors.white, marginTop: 4 },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(162,137,99,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  trendBadgeText: { ...typography.labelCaps, color: colors.tertiaryFixed },
  heroSubRow: { flexDirection: "row", gap: 48, marginTop: 24 },
  heroSubLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.6)" },
  heroSubAmount: { ...typography.titleMd, color: colors.white, marginTop: 4 },
});
