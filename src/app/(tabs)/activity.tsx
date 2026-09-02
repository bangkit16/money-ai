import { FilterChips } from "@/components/features/activity/filter-chips";
import { AppBar } from "@/components/features/shared/app-bar";
import { SearchBar } from "@/components/features/activity/search-bar";
import { DateSectionHeader } from "@/components/features/activity/date-section-header";
import { TransactionListItem } from "@/components/features/activity/transaction-list-item";
import { groupByDate } from "@/components/features/activity/utils";
import { Text } from "@/components/ui/text";
import { colors, spacing, typography } from "@/constants/theme";
import {
  ActivityService,
} from "@/services/activityService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";

type TxType = "INCOME" | "EXPENSE";

export default function ActivityScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | TxType>("all");

  const {
    data: transactions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ActivityService.keys.transactions,
    queryFn: ActivityService.GetTransactions,
  });

  const filteredSections = useMemo(() => {
    if (!transactions) return [];

    const filtered = transactions.filter((tx) => {
      const matchesFilter =
        activeFilter === "all" || tx.transaction_type === activeFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        (tx.transaction ?? "").toLowerCase().includes(q) ||
        (tx.category?.category ?? "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });

    return groupByDate(filtered);
  }, [transactions, query, activeFilter]);

  const handleEditPress = (
    transaction: import("@/services/activityService").ActivityTransactionRow
  ) => {
    router.push({ pathname: "/add-transaction", params: { id: String(transaction.id) } });
  };

  return (
    <View style={styles.screen}>
      <AppBar />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : error ? (
        <Text style={styles.emptyText}>
          Gagal memuat transaksi: {(error as Error).message}
        </Text>
      ) : (
        <SectionList
          sections={filteredSections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View style={styles.searchBlock}>
              <SearchBar value={query} onChangeText={setQuery} />
              <FilterChips activeFilter={activeFilter} onChange={setActiveFilter} />
            </View>
          }
          renderSectionHeader={({ section }) => (
            <DateSectionHeader label={section.label} />
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
            <Text style={styles.emptyText}>
              Tidak ada transaksi yang cocok.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { ...typography.bodySm, color: colors.onSurfaceVariant },

  listContent: { paddingHorizontal: spacing.marginMobile, paddingBottom: 40 },

  searchBlock: { gap: 24, paddingTop: 16, marginBottom: 8 },

  emptyText: {
    ...typography.bodyLg,
    color: colors.outline,
    textAlign: "center",
    marginTop: 40,
  },
});
