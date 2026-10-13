// migrated to useColor
import { SpendingStructureCard } from "@/components/features/analytics/spending-structure-card";
import { TopCategoriesList } from "@/components/features/analytics/top-categories-list";
import { AppBar } from "@/components/features/shared/app-bar";
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";
import { AnalyticsService, type AnalyticsType } from "@/services/analyticsService";
import { useSelector } from "@legendapp/state/react";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AnalyticsScreen() {
  // ponytail: fixed 2-type toggle; upgrade to multi-type filter or date range picker when needed
  const [activeType, setActiveType] = useState<AnalyticsType>("EXPENSE");
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const primaryForegroundColor = useColor("primaryForeground");
  const textMutedColor = useColor("textMuted");
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const t = useT();
  const { language } = useSettings();

  const data = useSelector(() =>
    AnalyticsService.ComputeCurrentMonth(language, activeType)
  );

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

        <View style={styles.toggleRow}>
          {(
            [
              { key: "EXPENSE", labelKey: "type.expense", icon: "arrow-upward" },
              { key: "INCOME", labelKey: "type.income", icon: "arrow-downward" },
            ] as const
          ).map((item) => {
            const active = activeType === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setActiveType(item.key)}
                style={[
                  styles.toggleButton,
                  { backgroundColor: cardColor, borderColor },
                  active && { backgroundColor: primaryColor, borderColor: primaryColor },
                  shadow.card,
                ]}
                activeOpacity={0.85}
              >
                <MaterialIcons
                  name={item.icon}
                  size={16}
                  color={active ? primaryForegroundColor : textMutedColor}
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    { color: textMutedColor },
                    active && { color: primaryForegroundColor },
                  ]}
                >
                  {t(item.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {data && (
          <>
            <SpendingStructureCard
              segments={data.segments}
              totalSpend={data.totalSpend}
              type={activeType}
            />
            <TopCategoriesList items={data.topCategories} type={activeType} />
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

  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  toggleButtonText: {
    ...typography.labelCaps,
    fontSize: 11,
  },

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