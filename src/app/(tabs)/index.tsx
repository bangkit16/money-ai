import { spacing } from "@/constants/theme";
import { HeroBalanceCard } from "@/components/features/dashboard/hero-balance-card";
import { MonthlySummaryCard } from "@/components/features/dashboard/monthly-summary-card";
import { RecentTransactions } from "@/components/features/dashboard/recent-transactions";
import { AppBar } from "@/components/features/shared/app-bar";
import { useColor } from "@/hooks/useColor";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { DashboardService } from "@/services/dashboardService";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSettings } from "@/providers/settings-provider";

export default function DashboardScreen() {
  const bgColor = useColor("background");
  const { language } = useSettings();

  // ponytail: reactive sync dengan Legend-State store (offline-first & realtime)
  const { transactions: allEnrichedTx, recentTransactions } = useTransactions();
  const { totalBalance } = useAccounts();

  const allTx = useMemo(() => {
    return allEnrichedTx.map((tx) => ({
      amount: tx.amount,
      transaction_type: tx.transaction_type,
      created_at: tx.created_at,
      account: tx.from_account,
      to_account: tx.to_account,
    }));
  }, [allEnrichedTx]);

  const summary = useMemo(() => {
    return DashboardService.computeSummary(allTx, totalBalance, language);
  }, [allTx, totalBalance, language]);

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HeroBalanceCard
          netWorth={summary.netWorth}
          trendPct={summary.trendPct}
          prevMonthNet={summary.prevMonthNet}
        />

        <MonthlySummaryCard
          income={summary.thisMonthIncome}
          expense={summary.thisMonthExpense}
          incomeBarWidth={summary.incomeBarWidth}
          expenseBarWidth={summary.expenseBarWidth}
          monthLabel={summary.monthLabel}
        />

        <RecentTransactions transactions={recentTransactions} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 120,
    gap: spacing.gutter,
  },
});
