import { formatCurrency } from "@/utils/formatCurrency";
import { colors, radius, typography } from "@/constants/theme";
import {
  getDisplaySubtitle,
  getDisplayTitle,
  getIcon,
  formatTime,
} from "./utils";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";

type TransactionListItemProps = {
  item: import("@/services/activityService").ActivityTransactionRow;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
};

export function TransactionListItem({
  item,
  isFirst,
  isLast,
  onPress,
}: TransactionListItemProps) {
  const title = getDisplayTitle(item);
  const subtitle = getDisplaySubtitle(item);
  const isTransfer = item.transaction_type === "TRANSFER";
  const fromName = item.from_account?.account_name;
  const toName = item.to_account?.account_name;
  const amountColor = isTransfer
    ? colors.onSurface
    : item.transaction_type === "EXPENSE"
      ? colors.error
      : colors.successGreen;
  const amountPrefix = isTransfer
    ? ""
    : item.transaction_type === "EXPENSE"
      ? "-"
      : "+";

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && styles.rowDivider,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <MaterialIcons
            name={getIcon(item.category, item.transaction_type) as any}
            size={20}
            color={colors.primary}
          />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {title}
          </Text>
          {isTransfer && fromName && toName ? (
            <View style={styles.transferRow}>
              <View style={styles.transferAccount}>
                <Text style={styles.transferLabel}>Dari</Text>
                <Text style={styles.transferName} numberOfLines={1}>
                  {fromName}
                </Text>
              </View>
              <MaterialIcons
                name="trending-flat"
                size={14}
                color={colors.onSurfaceVariant}
                style={styles.transferArrow}
              />
              <View style={styles.transferAccount}>
                <Text style={styles.transferLabel}>Ke</Text>
                <Text style={styles.transferName} numberOfLines={1}>
                  {toName}
                </Text>
              </View>
            </View>
          ) : subtitle ? (
            <Text style={styles.meta} numberOfLines={1}>
              {subtitle} • {formatTime(item.created_at)}
            </Text>
          ) : (
            <Text style={styles.meta} numberOfLines={1}>
              {formatTime(item.created_at)}
            </Text>
          )}
        </View>
      </View>
      <Text
        style={[styles.amount, { color: amountColor }]}
        numberOfLines={1}
      >
        {amountPrefix}
        {formatCurrency(item.amount)}
      </Text>
    </TouchableOpacity>
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
  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  transferAccount: { flexShrink: 1 },
  transferLabel: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    fontSize: 9,
    marginRight: 4,
  },
  transferName: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginRight: 6,
  },
  transferArrow: { marginHorizontal: 2 },
});
