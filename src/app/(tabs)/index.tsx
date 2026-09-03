// migrated to useColor
import { colors, spacing, typography } from "@/constants/theme";
import { HeroBalanceCard } from "@/components/features/dashboard/hero-balance-card";
import { MonthlySummaryCard } from "@/components/features/dashboard/monthly-summary-card";
import { RecentTransactions } from "@/components/features/dashboard/recent-transactions";
import { AppBar } from "@/components/features/shared/app-bar";
import { useColor } from "@/hooks/useColor";
import { DashboardService } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";

export default function DashboardScreen() {
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const textColor = useColor("text");
  const errorColor = useColor("error");

  // Semua transaksi (dipakai untuk hitung net worth, ringkasan bulan ini, & saldo per rekening)
  const {
    data: allTx,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: DashboardService.keys.transactions,
    queryFn: DashboardService.GetTransactions,
  });

  // 3 transaksi terbaru buat list "Recent Transactions"
  const {
    data: recentTx,
    isLoading: isLoadingRecent,
    error: errorRecent,
  } = useQuery({
    queryKey: DashboardService.keys.recentTransactions,
    queryFn: DashboardService.GetRecentTransactions,
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

    const monthLabel = now.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      netWorth,
      trendPct,
      prevMonthNet,
      thisMonthIncome,
      thisMonthExpense,
      incomeBarWidth,
      expenseBarWidth,
      monthLabel,
    };
  }, [allTx]);

  const isLoading = isLoadingAll || isLoadingRecent;
  const error = errorAll || errorRecent;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <AppBar />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={primaryColor} />
          <Text style={[styles.loadingText, { color: textMutedColor }]}>
            Loading dashboard...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: errorColor }]}>
            Gagal memuat data: {(error as Error).message}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HeroBalanceCard
            netWorth={summary?.netWorth ?? 0}
            trendPct={summary?.trendPct ?? 0}
            prevMonthNet={summary?.prevMonthNet ?? 0}
          />

          <MonthlySummaryCard
            income={summary?.thisMonthIncome ?? 0}
            expense={summary?.thisMonthExpense ?? 0}
            incomeBarWidth={summary?.incomeBarWidth ?? 0}
            expenseBarWidth={summary?.expenseBarWidth ?? 0}
            monthLabel={summary?.monthLabel}
          />

          <RecentTransactions transactions={recentTx} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { ...typography.bodySm },
  errorText: {
    ...typography.bodyLg,
    textAlign: "center",
    paddingHorizontal: spacing.marginMobile,
  },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 120,
    gap: spacing.gutter,
  },
});