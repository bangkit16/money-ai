// migrated to useColor
import { SpendingStructureCard } from "@/components/features/analytics/spending-structure-card";
import { TopCategoriesList } from "@/components/features/analytics/top-categories-list";
import { AppBar } from "@/components/features/shared/app-bar";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { AnalyticsService } from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnalyticsScreen() {
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const textColor = useColor("text");
  const t = useT();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: AnalyticsService.keys.current,
    queryFn: AnalyticsService.GetCurrentMonth,
  });

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 8 }}>
          <Text style={[styles.pageTitle, { color: primaryColor }]}>
            {t("analytics.title")}
          </Text>
          <Text style={[styles.pageSubtitle, { color: textMutedColor }]}>
            {data?.monthLabel ?? t("analytics.loadingInsights")}
          </Text>
        </View>

        {isLoading && (
          <View style={styles.center}>
            <Spinner size="lg" variant="circle" color={primaryColor} />
          </View>
        )}

        {isError && (
          <View style={styles.center}>
            <Text style={[styles.errorText, { color: textColor }]}>
              {t("analytics.error")}
            </Text>
            <Text
              style={[styles.retry, { color: primaryColor }]}
              onPress={() => refetch()}
            >
              {t("analytics.retry")}
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
              <Text style={[styles.titleMd, { color: textColor }]}>
                {t("analytics.topCategories")}
              </Text>
            </View>

            <TopCategoriesList items={data.topCategories} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 60,
    gap: spacing.gutter,
  },

  pageTitle: {
    ...typography.headlineLg,
    fontSize: 28,
    marginBottom: 4,
  },
  pageSubtitle: { ...typography.bodyLg },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  titleMd: { ...typography.titleMd },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 48 },
  errorText: { ...typography.bodyLg },
  retry: { ...typography.titleMd, marginTop: 8 },
});