import { formatCurrency } from "@/utils/formatCurrency";
import { colors, radius, shadow, typography } from "@/constants/theme";
import type { RecentTxRow } from "@/services/dashboardService";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  getDisplaySubtitle,
  getDisplayTitle,
  getIcon,
} from "@/components/features/activity/utils";

function getRelativeLabel(dateStr: string) {
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSourceLabel(tx: RecentTxRow): string {
  if (tx.transaction_type === "TRANSFER") {
    const from = tx.from_account?.account_name;
    const to = tx.to_account?.account_name;
    if (from && to) return `${from} → ${to}`;
    if (to) return `→ ${to}`;
    if (from) return `${from} →`;
  }
  return tx.from_account?.account_name ?? "—";
}

function TransactionRow({
  tx,
  isLast,
  onPress,
}: {
  tx: RecentTxRow;
  isLast: boolean;
  onPress: () => void;
}) {
  const title = getDisplayTitle(tx);
  const subtitle = getDisplaySubtitle(tx);
  const amountColor =
    tx.transaction_type === "TRANSFER"
      ? colors.onSurface
      : tx.transaction_type === "EXPENSE"
        ? colors.error
        : colors.successGreen;
  const amountPrefix =
    tx.transaction_type === "TRANSFER"
      ? ""
      : tx.transaction_type === "EXPENSE"
        ? "-"
        : "+";

  return (
    <TouchableOpacity
      style={[styles.txRow, !isLast && styles.txRowDivider]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.txLeft}>
        <View style={styles.txIconCircle}>
          <MaterialIcons
            name={getIcon(tx.category, tx.transaction_type) as any}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.txName} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.txMeta} numberOfLines={1}>
              {subtitle} • {getRelativeLabel(tx.created_at)}
            </Text>
          ) : (
            <Text style={styles.txMeta} numberOfLines={1}>
              {getRelativeLabel(tx.created_at)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: amountColor }]} numberOfLines={1}>
          {amountPrefix}
          {formatCurrency(tx.amount)}
        </Text>
        <Text style={styles.txSource}>{getSourceLabel(tx)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function RecentTransactions({
  transactions,
}: {
  transactions: RecentTxRow[] | undefined;
}) {
  const handleEditPress = (tx: RecentTxRow) => {
    router.push({ pathname: "/add-transaction", params: { id: String(tx.id) } });
  };

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.headline}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/activity")}>
          <Text style={styles.viewAllLink}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {transactions && transactions.length > 0 ? (
        <View style={[styles.card, shadow.card, { padding: 0 }]}>
          {transactions.map((tx, i) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              isLast={i === transactions.length - 1}
              onPress={() => handleEditPress(tx)}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>Belum ada transaksi.</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headline: { ...typography.headlineLgMobile, color: colors.onSurface },
  viewAllLink: { ...typography.labelCaps, color: colors.primary },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  txRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
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
    backgroundColor: colors.secondaryContainer + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  txName: { ...typography.titleMd, fontSize: 16, color: colors.onSurface },
  txMeta: { ...typography.bodySm, color: colors.outline },
  txRight: { alignItems: "flex-end" },
  txAmount: { ...typography.titleMd, fontSize: 16 },
  txSource: { ...typography.labelCaps, color: colors.outline, fontSize: 10 },

  emptyText: {
    ...typography.bodyLg,
    color: colors.outline,
    textAlign: "center",
    paddingVertical: 24,
  },
});
