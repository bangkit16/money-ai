import { Text } from "@/components/ui/text";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Platform,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../../constants/theme";

type TxType = "income" | "expense" | "investment";

type Transaction = {
  id: string;
  icon: string;
  name: string;
  category: string;
  time: string;
  amount: number;
  type: TxType;
};

// TODO: ganti dummy data ini dengan data asli (state/API)
const SECTIONS: { title: string; data: Transaction[] }[] = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        icon: "shopping-bag",
        name: "Luxury Boutique",
        category: "Shopping",
        time: "2:45 PM",
        amount: -1240.0,
        type: "expense",
      },
      {
        id: "2",
        icon: "restaurant",
        name: "The Gilded Fork",
        category: "Dining",
        time: "1:12 PM",
        amount: -156.4,
        type: "expense",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "3",
        icon: "payments",
        name: "Dividend Deposit",
        category: "Investment",
        time: "9:00 AM",
        amount: 2450.0,
        type: "investment",
      },
      {
        id: "4",
        icon: "directions-car",
        name: "Tesla Supercharger",
        category: "Transport",
        time: "Oct 23",
        amount: -22.5,
        type: "expense",
      },
    ],
  },
  {
    title: "October 22",
    data: [
      {
        id: "5",
        icon: "house",
        name: "Mortgage Payment",
        category: "Housing",
        time: "10:30 AM",
        amount: -3800.0,
        type: "expense",
      },
      {
        id: "6",
        icon: "payments",
        name: "Monthly Salary",
        category: "Income",
        time: "8:00 AM",
        amount: 8500.0,
        type: "income",
      },
      {
        id: "7",
        icon: "payments",
        name: "Monthly Salary",
        category: "Income",
        time: "8:00 AM",
        amount: 8500.0,
        type: "income",
      },
    ],
  },
];

const FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "income", label: "Income" },
  { key: "expense", label: "Expenses" },
  { key: "investment", label: "Investments" },
];

function formatCurrency(value: number) {
  const sign = value < 0 ? "-" : "+";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function ActivityScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | TxType>("all");

  const filteredSections = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      data: section.data.filter((tx) => {
        const matchesFilter =
          activeFilter === "all" || tx.type === activeFilter;
        const matchesQuery =
          query.trim().length === 0 ||
          tx.name.toLowerCase().includes(query.toLowerCase()) ||
          tx.category.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      }),
    })).filter((section) => section.data.length > 0);
  }, [query, activeFilter]);

  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>WealthFlow</Text>
        <TouchableOpacity hitSlop={10}>
          <MaterialIcons
            name="notifications"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={filteredSections}
        keyExtractor={(item) => item.id}
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

            {/* Filter chips */}
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
                      style={[styles.chipText, active && styles.chipTextActive]}
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
                  name={item.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text style={styles.txName}>{item.name}</Text>
                <Text style={styles.txMeta}>
                  {item.category} • {item.time}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: item.amount < 0 ? colors.error : colors.successGreen },
              ]}
            >
              {formatCurrency(item.amount)}
            </Text>
          </View>
        )}
        renderSectionFooter={() => <View style={{ height: spacing.gutter }} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Tidak ada transaksi yang cocok.</Text>
        }
      />
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
