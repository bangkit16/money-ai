import { formatCurrency } from "@/utils/formatCurrency";
import { colors, radius, typography } from "@/constants/theme";
import { getIcon, formatTime } from "./utils";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

type TransactionListItemProps = {
  item: import("@/services/activityService").ActivityTransactionRow;
  isFirst?: boolean;
  isLast?: boolean;
};

export function TransactionListItem({
  item,
  isFirst,
  isLast,
}: TransactionListItemProps) {
  return (
    <View
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && styles.rowDivider,
      ]}
    >
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <MaterialIcons
            name={getIcon(item.category, item.transaction_type) as any}
            size={20}
            color={colors.primary}
          />
        </View>
        <View>
          <Text style={styles.name}>
            {item.transaction || item.category?.category || "Transaction"}
          </Text>
          <Text style={styles.meta}>
            {item.category?.category ?? "Uncategorized"} •{" "}
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.amount,
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
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 20,
  },
  rowFirst: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  rowLast: {
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant + "1a",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary + "1a",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { ...typography.bodyLg, fontWeight: "600", color: colors.onSurface },
  meta: { ...typography.bodySm, color: colors.onSurfaceVariant },
  amount: { ...typography.titleMd, fontSize: 16 },
});
