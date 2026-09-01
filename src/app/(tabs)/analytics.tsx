import { SpendingStructureCard } from "@/components/features/analytics/spending-structure-card";
import { TopCategoriesList } from "@/components/features/analytics/top-categories-list";
import { AppBar } from "@/components/features/shared/app-bar";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import {
  colors,
  spacing,
  typography,
} from "@/constants/theme";
import { AnalyticsService } from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnalyticsScreen() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: AnalyticsService.keys.current,
    queryFn: AnalyticsService.GetCurrentMonth,
  });

  return (
    <View style={styles.screen}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.pageTitle}>Financial Analytics</Text>
          <Text style={styles.pageSubtitle}>
            {data?.monthLabel ?? "Loading insights..."}
          </Text>
        </View>

        {isLoading && (
          <View style={styles.center}>
            <Spinner size="lg" variant="circle" color={colors.primary} />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <Text style={styles.errorText}>Failed to load analytics.</Text>
            <Text style={styles.retry} onPress={() => refetch()}>
              Tap to retry
            </Text>
          </View>
        )}

        {data && (
          <>
            <SpendingStructureCard
              segments={data.segments}
              totalSpend={data.totalSpend}
            />

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.titleMd}>Top Spending Categories</Text>
            </View>

            <TopCategoriesList items={data.topCategories} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

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

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  titleMd: { ...typography.titleMd, color: colors.onSurface },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  errorText: { ...typography.bodyLg, color: colors.onSurface },
  retry: { ...typography.bodyMd, color: colors.primary, marginTop: 8 },
});