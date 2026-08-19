import {
  View,
  // Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "@/constants/theme";
import { Text } from "@/components/ui/text";

// TODO: ganti dummy data ini dengan data asli (state/API)
const netWorth = 482950;
const availableCash = 124400;
const investments = 358550;
const trendPct = 4.2;

const income = 12450;
const expenses = 4280;

const trendBars = [40, 55, 50, 75, 65, 90, 85]; // persen tinggi bar, 7 hari terakhir

const recentTransactions = [
  {
    id: "1",
    icon: "shopping-bag",
    name: "Apple Store",
    category: "Technology & Gear",
    time: "Today",
    amount: -1299.0,
    source: "VISA •••• 4242",
  },
  {
    id: "2",
    icon: "payments",
    name: "Monthly Salary",
    category: "Professional Services",
    time: "Yesterday",
    amount: 8500.0,
    source: "CHASE BANK",
  },
  {
    id: "3",
    icon: "restaurant",
    name: "The Gilded Fork",
    category: "Fine Dining",
    time: "Oct 24",
    amount: -342.5,
    source: "AMEX PLATINUM",
  },
];

function formatCurrency(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>

          <Text style={styles.wordmark}>Dompety</Text>
        </View>
        <TouchableOpacity hitSlop={10}>
          <MaterialIcons
            name="notifications"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Balance Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroCard, shadow.heroCard]}
        >
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>TOTAL NET WORTH</Text>
              <Text style={styles.heroAmount}>{formatCurrency(netWorth)}</Text>
            </View>
            <View style={styles.trendBadge}>
              <MaterialIcons
                name="trending-up"
                size={16}
                color={colors.tertiaryFixed}
              />
              <Text style={styles.trendBadgeText}>+{trendPct}%</Text>
            </View>
          </View>
          <View style={styles.heroSubRow}>
            <View>
              <Text style={styles.heroSubLabel}>AVAILABLE CASH</Text>
              <Text style={styles.heroSubAmount}>
                {formatCurrency(availableCash)}
              </Text>
            </View>
            <View>
              <Text style={styles.heroSubLabel}>INVESTMENTS</Text>
              <Text style={styles.heroSubAmount}>
                {formatCurrency(investments)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Income / Expenses summary */}
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
                  { width: "85%", backgroundColor: colors.primary },
                ]}
              />
            </View>
          </View>
          <View style={[styles.summaryCol, styles.summaryColBorder]}>
            <View style={styles.summaryLabelRow}>
              <MaterialIcons
                name="arrow-upward"
                size={18}
                color={colors.error}
              />
              <Text style={styles.summaryLabel}>EXPENSES</Text>
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(expenses)}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: "40%", backgroundColor: colors.tertiaryFixedDim },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.headlineMobile}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/activity")}>
            <Text style={styles.viewAllLink}>VIEW ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, shadow.card, { padding: 0 }]}>
          {recentTransactions.map((tx, i) => (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                i !== recentTransactions.length - 1 && styles.txRowDivider,
              ]}
            >
              <View style={styles.txLeft}>
                <View style={styles.txIconCircle}>
                  <MaterialIcons
                    name={tx.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txMeta}>
                    {tx.category} • {tx.time}
                  </Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text
                  style={[
                    styles.txAmount,
                    {
                      color:
                        tx.amount < 0 ? colors.error : colors.successGreen,
                    },
                  ]}
                >
                  {formatCurrency(tx.amount)}
                </Text>
                <Text style={styles.txSource}>{tx.source}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: radius.full },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 120,
    gap: spacing.gutter,
  },

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

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
  },
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

  chartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleMd: { ...typography.titleMd, color: colors.onSurface },
  mutedLabel: { ...typography.labelCaps, color: colors.outline },
  barChartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 96,
  },
  barTrack: { flex: 1, height: "100%", justifyContent: "flex-end" },
  bar: {
    width: "100%",
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headlineMobile: { ...typography.headlineLgMobile, color: colors.onSurface },
  viewAllLink: { ...typography.labelCaps, color: colors.primary },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  txRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  txIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  txName: { ...typography.titleMd, fontSize: 16, color: colors.onSurface },
  txMeta: { ...typography.bodySm, color: colors.outline },
  txRight: { alignItems: "flex-end" },
  txAmount: { ...typography.titleMd, fontSize: 16 },
  txSource: { ...typography.labelCaps, color: colors.outline, fontSize: 10 },
});
