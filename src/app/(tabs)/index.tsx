import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, typography, radius, spacing, shadow } from "@/constants/theme";
import { formatCurrency } from '@/utils/formatCurrency';
import { Text } from "@/components/ui/text";

// TODO: sama seperti activity.tsx & analytics.tsx — enaknya map ini
// dipindah ke satu file util bersama supaya nggak triplicate.
const ICON_BY_SLUG: Record<string, string> = {
  food: "restaurant",
  shopping: "shopping-bag",
  bills: "receipt",
  travel: "flight",
  transport: "directions-car",
  auto: "directions-car",
  health: "medical-services",
  fun: "movie",
  entertainment: "movie",
  housing: "home",
  salary: "payments",
  others: "more-horiz",
};

type TxType = "INCOME" | "EXPENSE";

type AllTxRow = {
  amount: number;
  transaction_type: TxType;
  created_at: string;
  account: { id: number; account_name: string } | null;
};

type RecentTxRow = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TxType;
  category: { category: string; slug: string } | null;
  account: { account_name: string } | null;
};

function getRelativeLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function DashboardScreen() {
  // Semua transaksi (dipakai untuk hitung net worth, ringkasan bulan ini, & saldo per rekening)
  const {
    data: allTx,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction")
        .select(
          "amount, transaction_type, created_at, account:account(id, account_name)",
        );
      if (error) throw new Error(error.message);
      return data as unknown as AllTxRow[];
    },
  });

  // 3 transaksi terbaru buat list "Recent Transactions"
  const {
    data: recentTx,
    isLoading: isLoadingRecent,
    error: errorRecent,
  } = useQuery({
    queryKey: ["dashboard-recent-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction")
        .select(
          "id, created_at, transaction, amount, transaction_type, category:category_transaction(category, slug), account:account(account_name)",
        )
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw new Error(error.message);
      return data as unknown as RecentTxRow[];
    },
  });

  const summary = useMemo(() => {
    if (!allTx) return null;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    let totalIncome = 0;
    let totalExpense = 0;
    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    let prevMonthIncome = 0;
    let prevMonthExpense = 0;
    const accountBalances = new Map<
      number,
      { name: string; balance: number }
    >();

    for (const tx of allTx) {
      const isIncome = tx.transaction_type === "INCOME";
      const signedAmount = isIncome ? tx.amount : -tx.amount;

      if (isIncome) totalIncome += tx.amount;
      else totalExpense += tx.amount;

      const txDate = new Date(tx.created_at);
      if (txDate >= monthStart) {
        if (isIncome) thisMonthIncome += tx.amount;
        else thisMonthExpense += tx.amount;
      } else if (txDate >= prevMonthStart && txDate < monthStart) {
        if (isIncome) prevMonthIncome += tx.amount;
        else prevMonthExpense += tx.amount;
      }

      if (tx.account) {
        const existing = accountBalances.get(tx.account.id);
        if (existing) {
          existing.balance += signedAmount;
        } else {
          accountBalances.set(tx.account.id, {
            name: tx.account.account_name,
            balance: signedAmount,
          });
        }
      }
    }

    const netWorth = totalIncome - totalExpense;
    const thisMonthNet = thisMonthIncome - thisMonthExpense;
    const prevMonthNet = prevMonthIncome - prevMonthExpense;
    const trendPct =
      prevMonthNet !== 0
        ? ((thisMonthNet - prevMonthNet) / Math.abs(prevMonthNet)) * 100
        : thisMonthNet !== 0
          ? 100
          : 0;

    const topAccounts = Array.from(accountBalances.values())
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 2);

    const flowTotal = thisMonthIncome + thisMonthExpense;
    const incomeBarWidth =
      flowTotal > 0 ? (thisMonthIncome / flowTotal) * 100 : 0;
    const expenseBarWidth =
      flowTotal > 0 ? (thisMonthExpense / flowTotal) * 100 : 0;

    return {
      netWorth,
      trendPct,
      topAccounts,
      thisMonthIncome,
      thisMonthExpense,
      incomeBarWidth,
      expenseBarWidth,
    };
  }, [allTx]);

  const isLoading = isLoadingAll || isLoadingRecent;
  const error = errorAll || errorRecent;

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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>
            Gagal memuat data: {(error as Error).message}
          </Text>
        </View>
      ) : (
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
                <Text style={styles.heroLabel}>TOTAL BALANCE</Text>
                <Text style={styles.heroAmount}>
                  {formatCurrency(summary?.netWorth ?? 0)}
                </Text>
              </View>
              <View style={styles.trendBadge}>
                <MaterialIcons
                  name={
                    (summary?.trendPct ?? 0) >= 0
                      ? "trending-up"
                      : "trending-down"
                  }
                  size={16}
                  color={colors.tertiaryFixed}
                />
                <Text style={styles.trendBadgeText}>
                  {(summary?.trendPct ?? 0) >= 0 ? "+" : ""}
                  {(summary?.trendPct ?? 0).toFixed(1)}%
                </Text>
              </View>
            </View>
            <View style={styles.heroSubRow}>
              {summary && summary.topAccounts.length > 0 ? (
                summary.topAccounts.map((acc) => (
                  <View key={acc.name}>
                    <Text style={styles.heroSubLabel}>
                      {acc.name.toUpperCase()}
                    </Text>
                    <Text style={styles.heroSubAmount}>
                      {formatCurrency(acc.balance)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.heroSubLabel}>Belum ada rekening</Text>
              )}
            </View>
          </LinearGradient>

          {/* Income / Expenses summary (bulan berjalan) */}
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
              <Text style={styles.summaryAmount}>
                {formatCurrency(summary?.thisMonthIncome ?? 0)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${summary?.incomeBarWidth ?? 0}%`,
                      backgroundColor: colors.primary,
                    },
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
              <Text style={styles.summaryAmount}>
                {formatCurrency(summary?.thisMonthExpense ?? 0)}
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${summary?.expenseBarWidth ?? 0}%`,
                      backgroundColor: colors.tertiaryFixedDim,
                    },
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

          {recentTx && recentTx.length > 0 ? (
            <View style={[styles.card, shadow.card, { padding: 0 }]}>
              {recentTx.map((tx, i) => (
                <View
                  key={tx.id}
                  style={[
                    styles.txRow,
                    i !== recentTx.length - 1 && styles.txRowDivider,
                  ]}
                >
                  <View style={styles.txLeft}>
                    <View style={styles.txIconCircle}>
                      <MaterialIcons
                        name={
                          (ICON_BY_SLUG[tx.category?.slug ?? ""] ??
                            (tx.transaction_type === "INCOME"
                              ? "payments"
                              : "receipt-long")) as any
                        }
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View>
                      <Text style={styles.txName}>
                        {tx.transaction ||
                          tx.category?.category ||
                          "Transaction"}
                      </Text>
                      <Text style={styles.txMeta}>
                        {tx.category?.category ?? "Uncategorized"} •{" "}
                        {getRelativeLabel(tx.created_at)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.txRight}>
                    <Text
                      style={[
                        styles.txAmount,
                        {
                          color:
                            tx.transaction_type === "EXPENSE"
                              ? colors.error
                              : colors.successGreen,
                        },
                      ]}
                    >
                      {tx.transaction_type === "EXPENSE" ? "-" : "+"}
                      {formatCurrency(tx.amount)}
                    </Text>
                    <Text style={styles.txSource}>
                      {tx.account?.account_name ?? "—"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Belum ada transaksi.</Text>
          )}
        </ScrollView>
      )}
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
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { ...typography.bodySm, color: colors.onSurfaceVariant },
  errorText: {
    ...typography.bodyLg,
    color: colors.error,
    textAlign: "center",
    paddingHorizontal: spacing.marginMobile,
  },

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

  emptyText: {
    ...typography.bodyLg,
    color: colors.outline,
    textAlign: "center",
    paddingVertical: 24,
  },
});
