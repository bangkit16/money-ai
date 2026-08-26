import { SpendingStructureCard } from "@/components/features/analytics/spending-structure-card";
import { TopCategoriesList } from "@/components/features/analytics/top-categories-list";
import { AppBar } from "@/components/features/shared/app-bar";
import { Text } from "@/components/ui/text";
import {
  colors,
  spacing,
  typography,
} from "@/constants/theme";
import { ScrollView, StyleSheet, View } from "react-native";

// TODO: ganti dummy data ini dengan data asli (state/API)
const period = "Insights for September 2023";

export default function AnalyticsScreen() {
  return (
    <View style={styles.screen}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 8 }}>
          <Text style={styles.pageTitle}>Financial Analytics</Text>
          <Text style={styles.pageSubtitle}>{period}</Text>
        </View>

        <SpendingStructureCard />

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.titleMd}>Top Spending Categories</Text>
        </View>

        <TopCategoriesList />
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
});
