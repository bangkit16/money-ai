import { Text } from "@/components/ui/text";
import {
  ActivityService,
  type ActivityTransactionRow,
} from "@/services/activityService";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../../constants/theme";
import { formatCurrency } from '@/utils/formatCurrency';

type TxType = "INCOME" | "EXPENSE";

type TransactionRow = ActivityTransactionRow;

const FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "EXPENSE", label: "Expenses" },
  { key: "INCOME", label: "Income" },
];

// DB belum punya kolom icon per kategori, jadi kita map manual dari slug.
// TODO: sesuaikan key-nya dengan slug asli di tabel category_transaction kamu.
const ICON_BY_SLUG: Record<string, string> = {
  food: "restaurant",
  shopping: "shopping-bag",
  bills: "receipt",
  travel: "flight",
  transport: "directions-car",
  auto: "directions-car",
  health: "medical-services",
  fun: "movie",
  entertainment: "movie",
  housing: "house",
  salary: "payments",
  others: "more-horiz",
};

function getIcon(category: TransactionRow["category"], type: TxType) {
  if (category?.slug && ICON_BY_SLUG[category.slug])
    return ICON_BY_SLUG[category.slug];
  return type === "INCOME" ? "payments" : "receipt-long";
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

// Kelompokkan array transaksi (sudah terurut created_at desc) jadi section per tanggal
function groupByDate(transactions: TransactionRow[]) {
  const sections: { title: string; data: TransactionRow[] }[] = [];

  for (const tx of transactions) {
    const label = getDateLabel(tx.created_at);
    const lastSection = sections[sections.length - 1];
    if (lastSection && lastSection.title === label) {
      lastSection.data.push(tx);
    } else {
      sections.push({ title: label, data: [tx] });
    }
  }

  return sections;
}

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

  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>Dompety</Text>
        <TouchableOpacity hitSlop={10}>
          <MaterialIcons
            name="notifications"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

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
              {/* Search bar */}
              <View style={styles.searchInputWrap}>
                <MaterialIcons
                  name="search"
                  size={20}
                  color={colors.outline}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search transactions..."
                  placeholderTextColor={colors.outline}
                  style={styles.searchInput}
                />
              </View>

              {/* Filter chips: hanya Expense & Income */}
              <View style={styles.filterRow}>
                {FILTERS.map((f) => {
                  const active = activeFilter === f.key;
                  return (
                    <TouchableOpacity
                      key={f.key}
                      onPress={() => setActiveFilter(f.key)}
                      style={[styles.chip, active && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
              <View style={styles.sectionHeaderLine} />
            </View>
          )}
          renderItem={({ item, index, section }) => (
            <View
              style={[
                styles.txRow,
                index === 0 && styles.txRowFirst,
                index === section.data.length - 1 && styles.txRowLast,
                index !== section.data.length - 1 && styles.txRowDivider,
              ]}
            >
              <View style={styles.txLeft}>
                <View style={styles.txIconCircle}>
                  <MaterialIcons
                    name={getIcon(item.category, item.transaction_type) as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View>
                  <Text style={styles.txName}>
                    {item.transaction ||
                      item.category?.category ||
                      "Transaction"}
                  </Text>
                  <Text style={styles.txMeta}>
                    {item.category?.category ?? "Uncategorized"} •{" "}
                    {formatTime(item.created_at)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  {
                    color:
                      item.transaction_type === "EXPENSE"
                        ? colors.error
                        : colors.successGreen,
                  },
                ]}
              >
                {formatCurrency(item.amount, item.transaction_type)}
              </Text>
            </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: { ...typography.bodySm, color: colors.onSurfaceVariant },

  listContent: { paddingHorizontal: spacing.marginMobile, paddingBottom: 40 },

  searchBlock: { gap: 24, paddingTop: 16, marginBottom: 8 },
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface,
    padding: 0,
  },

  filterRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant + "4d",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.white },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionHeaderText: { ...typography.titleMd, color: colors.onSurfaceVariant },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant + "4d",
  },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
  },
  txRowFirst: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  txRowLast: {
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  txRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + "1a",
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  txIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary + "1a",
    alignItems: "center",
    justifyContent: "center",
  },
  txName: { ...typography.bodyLg, fontWeight: "600", color: colors.onSurface },
  txMeta: { ...typography.bodySm, color: colors.onSurfaceVariant },
  txAmount: { ...typography.titleMd, fontSize: 16 },

  emptyText: {
    ...typography.bodyLg,
    color: colors.outline,
    textAlign: "center",
    marginTop: 40,
  },
});
