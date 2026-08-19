import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { MaterialIcons } from "@expo/vector-icons";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "../../constants/theme";
import { Text } from "@/components/ui/text";

// TODO: ganti dummy data ini dengan data asli (state/API)
const period = "Insights for September 2023";
const totalSpend = 4280;

const donutSegments = [
  { label: "Rent (40%)", value: 40, color: colors.primary },
  { label: "Food (25%)", value: 25, color: colors.secondary },
  { label: "Transport (20%)", value: 20, color: colors.tertiaryFixedDim },
  { label: "Other (15%)", value: 15, color: colors.secondaryContainer },
];

const insight = {
  title: "Spending Insight",
  text: "Your food expenditure decreased by 12% compared to last month. Great job managing your variables!",
  delta: "-$420",
  deltaLabel: "VS PREVIOUS MONTH",
};

const topCategories = [
  {
    icon: "home",
    name: "Rent & Housing",
    subtitle: "Monthly recurring",
    amount: 1712.0,
    percent: 85,
    color: colors.primary,
  },
  {
    icon: "restaurant",
    name: "Food & Dining",
    subtitle: "Grocery + Restaurants",
    amount: 1070.0,
    percent: 55,
    color: colors.secondary,
  },
  {
    icon: "directions-car",
    name: "Transport",
    subtitle: "Fuel + Transit",
    amount: 856.0,
    percent: 40,
    color: colors.onTertiaryContainer,
  },
];

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function DonutChart({
  size = 200,
  strokeWidth = 18,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  const radiusPx = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusPx;
  let cumulativePercent = 0;

  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radiusPx}
        stroke={colors.surfaceContainer}
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {donutSegments.map((seg, i) => {
        const dash = (seg.value / 100) * circumference;
        const offset =
          circumference - (cumulativePercent / 100) * circumference;
        cumulativePercent += seg.value;
        return (
          <Circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radiusPx}
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={offset}
            fill="transparent"
            strokeLinecap="butt"
          />
        );
      })}
    </Svg>
  );
}

export default function AnalyticsScreen() {
  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>Dompety</Text>
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
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.pageTitle}>Financial Analytics</Text>
          <Text style={styles.pageSubtitle}>{period}</Text>
        </View>

        {/* Donut chart card */}
        <View style={[styles.card, shadow.card, { alignItems: "center" }]}>
          <Text
            style={[
              styles.titleMd,
              { alignSelf: "flex-start", marginBottom: 16 },
            ]}
          >
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
            <DonutChart />
            <View style={styles.donutCenter}>
              <Text style={styles.mutedLabel}>TOTAL</Text>
              <Text style={styles.donutTotal}>
                {formatCurrency(totalSpend)}
              </Text>
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

        {/* Insight card */}
        <View style={[styles.card, styles.insightCard, shadow.card]}>
          <View>
            <MaterialIcons
              name="trending-down"
              size={24}
              color={colors.tertiaryFixed}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightText}>{insight.text}</Text>
          </View>
          <View style={{ marginTop: 24 }}>
            <Text style={styles.insightDelta}>{insight.delta}</Text>
            <Text style={styles.insightDeltaLabel}>{insight.deltaLabel}</Text>
          </View>
        </View>

        {/* Top categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.titleMd}>Top Spending Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>VIEW ALL REPORTS</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, shadow.card, { padding: 0 }]}>
          {topCategories.map((cat, i) => (
            <View
              key={cat.name}
              style={[
                styles.catRow,
                i !== topCategories.length - 1 && styles.catRowDivider,
              ]}
            >
              <View style={styles.txLeft}>
                <View
                  style={[
                    styles.catIconCircle,
                    { backgroundColor: cat.color + "1a" },
                  ]}
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={20}
                    color={cat.color}
                  />
                </View>
                <View>
                  <Text style={styles.txName}>{cat.name}</Text>
                  <Text style={styles.txMeta}>{cat.subtitle}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.catAmount}>
                  {formatCurrency(cat.amount)}
                </Text>
                <View style={styles.catProgressTrack}>
                  <View
                    style={[
                      styles.catProgressFill,
                      { width: `${cat.percent}%`, backgroundColor: cat.color },
                    ]}
                  />
                </View>
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
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 60,
    gap: spacing.gutter,
  },

  pageTitle: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginBottom: 4,
  },
  pageSubtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant },

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

  insightCard: {
    backgroundColor: colors.primary,
    justifyContent: "space-between",
  },
  insightTitle: { ...typography.titleMd, color: colors.white, marginBottom: 8 },
  insightText: {
    ...typography.bodySm,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  insightDelta: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.tertiaryFixed,
  },
  insightDeltaLabel: {
    ...typography.labelCaps,
    color: "rgba(255,255,255,0.6)",
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  viewAllLink: { ...typography.labelCaps, color: colors.secondary },

  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  catRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.platinumMist + "4d",
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  catIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  txName: { ...typography.bodyLg, fontWeight: "600", color: colors.primary },
  txMeta: { ...typography.bodySm, color: colors.onSurfaceVariant },
  catAmount: { ...typography.bodyLg, fontWeight: "600", color: colors.primary },
  catProgressTrack: {
    width: 96,
    height: 4,
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.full,
    marginTop: 8,
    overflow: "hidden",
  },
  catProgressFill: { height: "100%", borderRadius: radius.full },
});
