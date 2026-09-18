// migrated to useColor
import { FilterChips } from "@/components/features/activity/filter-chips";
import { AppBar } from "@/components/features/shared/app-bar";
import { SearchBar } from "@/components/features/activity/search-bar";
import { DateSectionHeader } from "@/components/features/activity/date-section-header";
import { TransactionListItem } from "@/components/features/activity/transaction-list-item";
import { groupByDate } from "@/components/features/activity/utils";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useDebounce } from "@/hooks/useDebounce";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";
import { ActivityService } from "@/services/activityService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

export default function ActivityScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | TxType>("all");

  const debouncedQuery = useDebounce(query, 500);

  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const outlineColor = useColor("border");
  const t = useT();
  const { language } = useSettings();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions", activeFilter, debouncedQuery],
    queryFn: ({ pageParam = 0 }) => ActivityService.GetTransactions(pageParam, 10, activeFilter, debouncedQuery),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length : undefined,
  });


  const allTransactions = useMemo(() => data?.pages.flat() ?? [], [data]);

  const filteredSections = useMemo(() => {
    if (!allTransactions.length) return [];
    return groupByDate(allTransactions, t, language);
  }, [allTransactions, t, language]);

  const handleEditPress = (
    transaction: import("@/services/activityService").ActivityTransactionRow
  ) => {
    router.push({ pathname: "/add-transaction", params: { id: String(transaction.id) } });
  };

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <AppBar />

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
          <View style={styles.searchBlock}>
            <SearchBar value={query} onChangeText={setQuery} />
            <FilterChips activeFilter={activeFilter} onChange={setActiveFilter} />
          </View>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={primaryColor} />
                <Text style={[styles.loadingText, { color: textMutedColor }]}>
                  {t("activity.loading")}
                </Text>
              </View>
            )}
          </>
        }
        renderSectionHeader={({ section }) => (
          <DateSectionHeader label={section.label} total={section.total} />
        )}
        renderItem={({ item, index, section }) => (
          <TransactionListItem
            item={item}
            isFirst={index === 0}
            isLast={index === section.data.length - 1}
            onPress={() => handleEditPress(item)}
          />
        )}
        renderSectionFooter={() => (
          <View style={{ height: spacing.gutter }} />
        )}
        ListEmptyComponent={
          error ? (
            <Text style={[styles.emptyText, { color: outlineColor }]}>
              {t("activity.loadError", { message: (error as Error).message })}
            </Text>
          ) : (
            <Text style={[styles.emptyText, { color: outlineColor }]}>
              {t("activity.empty")}
            </Text>
          )
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={primaryColor} />
              <Text style={[styles.loadingText, { color: textMutedColor }]}>
                {t("activity.loading")}
              </Text>
            </View>
          ) : null
        }
      />
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

  listContent: { paddingHorizontal: spacing.marginMobile, paddingBottom: 40 },

  searchBlock: { gap: 24, paddingTop: 16, marginBottom: 8 },

  emptyText: {
    ...typography.bodyLg,
    textAlign: "center",
    marginTop: 40,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
});