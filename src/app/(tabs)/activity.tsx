// migrated to useColor
import { AccountFilterDropdown } from "@/components/features/activity/account-filter-dropdown";
import { DateSectionHeader } from "@/components/features/activity/date-section-header";
import { FilterChips } from "@/components/features/activity/filter-chips";
import { SearchBar } from "@/components/features/activity/search-bar";
import { TransactionListItem } from "@/components/features/activity/transaction-list-item";
import { ActivityBannerAd } from "@/components/features/activity/banner-ad";
import { groupByDate } from "@/components/features/activity/utils";
import { AppBar } from "@/components/features/shared/app-bar";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useAccounts } from "@/hooks/useAccounts";
import { useColor } from "@/hooks/useColor";
import { useDebounce } from "@/hooks/useDebounce";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";
import { ActivityService } from "@/services/activityService";
import { isPro$ } from "@/store/profile$";
import { useSelector } from "@legendapp/state/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, SectionList, StyleSheet, View } from "react-native";

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

export default function ActivityScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | TxType>("all");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  const debouncedQuery = useDebounce(query, 500);

  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const outlineColor = useColor("border");
  const t = useT();
  const { language } = useSettings();
  const isPro = useSelector(isPro$);
  const { accountOptions } = useAccounts();

  const effectiveAccountId =
    selectedAccountId !== null &&
    accountOptions.some((acc) => acc.id === selectedAccountId)
      ? selectedAccountId
      : null;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["transactions", activeFilter, debouncedQuery, effectiveAccountId],
    queryFn: ({ pageParam = 0 }) =>
      ActivityService.GetTransactions(
        pageParam,
        10,
        activeFilter,
        debouncedQuery,
        effectiveAccountId,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length > 0 ? allPages.length : undefined,
  });

  const allTransactions = useMemo(() => data?.pages.flat() ?? [], [data]);

  const filteredSections = useMemo(() => {
    if (!allTransactions.length) return [];
    return groupByDate(allTransactions, t, language);
  }, [allTransactions, t, language]);

  const handleEditPress = (
    transaction: import("@/services/activityService").ActivityTransactionRow,
  ) => {
    router.push({
      pathname: "/add-transaction",
      params: { id: String(transaction.id) },
    });
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
              <FilterChips
                activeFilter={activeFilter}
                onChange={setActiveFilter}
                prefix={
                  accountOptions.length > 0 ? (
                    <AccountFilterDropdown
                      accounts={accountOptions}
                      selectedAccountId={effectiveAccountId}
                      onChange={setSelectedAccountId}
                    />
                  ) : null
                }
              />
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
        renderSectionFooter={() => <View style={{ height: spacing.gutter }} />}
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
      {!isPro && (
        <View style={[styles.bannerWrapper, { backgroundColor: bgColor }]}>
          <ActivityBannerAd />
        </View>
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

  listContent: { paddingHorizontal: spacing.marginMobile, paddingBottom: 150 },

  searchBlock: { gap: 16, paddingTop: 16, marginBottom: 8 },

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

  bannerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    width: "100%",
    height: 60,
    zIndex: 1,
  },
});
