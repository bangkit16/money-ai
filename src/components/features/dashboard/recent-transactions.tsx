import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const { formatCurrency } = useFormatCurrency();
  const onSurfaceColor = useColor("onSurface");
  const errorColor = useColor("error");
  const successColor = useColor("successGreen");
  const primaryColor = useColor("primary");
  const outlineColor = useColor("outline");
  const secondaryContainerColor = useColor("secondaryContainer");
  const title = getDisplayTitle(tx);
  const subtitle = getDisplaySubtitle(tx);
  const amountColor =
    tx.transaction_type === "TRANSFER"
      ? onSurfaceColor
      : tx.transaction_type === "EXPENSE"
        ? errorColor
        : successColor;
  const amountPrefix =
    tx.transaction_type === "TRANSFER"
      ? ""
      : tx.transaction_type === "EXPENSE"
        ? "-"
        : "+";

  return (
    <TouchableOpacity
      style={styles.txRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.txLeft}>
        <View style={[styles.txIconCircle, { backgroundColor: secondaryContainerColor + "66" }]}>
          <MaterialIcons
            name={getIcon(tx.category, tx.transaction_type) as any}
            size={20}
            color={primaryColor}
          />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.txName, { color: onSurfaceColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.txMeta, { color: outlineColor }]} numberOfLines={1}>
              {subtitle} • {getRelativeLabel(tx.created_at)}
            </Text>
          ) : (
            <Text style={[styles.txMeta, { color: outlineColor }]} numberOfLines={1}>
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
        <Text style={[styles.txSource, { color: outlineColor }]}>{getSourceLabel(tx)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function RecentTransactions({
  transactions,
}: {
  transactions: RecentTxRow[] | undefined;
}) {
  const cardColor = useColor("card");
  const onSurfaceColor = useColor("onSurface");
  const outlineColor = useColor("outline");
  const primaryColor = useColor("primary");
  const dividerColor = useColor("surfaceContainerHighest");

  const handleEditPress = (tx: RecentTxRow) => {
    router.push({ pathname: "/add-transaction", params: { id: String(tx.id) } });
  };

  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.headline, { color: onSurfaceColor }]}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/activity")}>
          <Text style={[styles.viewAllLink, { color: primaryColor }]}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {transactions && transactions.length > 0 ? (
        <View style={[styles.card, shadow.card, { padding: 0, backgroundColor: cardColor }]}>
          {transactions.map((tx, i) => (
            <View key={tx.id} style={i !== transactions.length - 1 ? { borderBottomColor: dividerColor, borderBottomWidth: 1 } : undefined}>
              <TransactionRow
                tx={tx}
                isLast={i === transactions.length - 1}
                onPress={() => handleEditPress(tx)}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: outlineColor }]}>Belum ada transaksi.</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 24 },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headline: { ...typography.headlineLgMobile },
  viewAllLink: { ...typography.labelCaps },

  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
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
    alignItems: "center",
    justifyContent: "center",
  },
  txName: { ...typography.titleMd, fontSize: 16 },
  txMeta: { ...typography.bodySm },
  txRight: { alignItems: "flex-end" },
  txAmount: { ...typography.titleMd, fontSize: 16 },
  txSource: { ...typography.labelCaps, fontSize: 10 },

  emptyText: {
    ...typography.bodyLg,
    textAlign: "center",
    paddingVertical: 24,
  },
});
