// migrated to useColor
import { SpendingStructureCard } from "@/components/features/analytics/spending-structure-card";
import { TopCategoriesList } from "@/components/features/analytics/top-categories-list";
import { AppBar } from "@/components/features/shared/app-bar";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";
import { AnalyticsService } from "@/services/analyticsService";
import { useSelector } from "@legendapp/state/react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AnalyticsScreen() {
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const t = useT();
  const { language } = useSettings();

  const data = useSelector(() => AnalyticsService.ComputeCurrentMonth(language));

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

        {data && (
          <>
            <SpendingStructureCard
              segments={data.segments}
              totalSpend={data.totalSpend}
            />
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
    fontSize: 22,
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