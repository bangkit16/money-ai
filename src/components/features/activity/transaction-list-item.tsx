import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useColor } from "@/hooks/useColor";
import { radius, typography } from "@/constants/theme";
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
  const cardColor = useColor("card");
  const onSurfaceColor = useColor("onSurface");
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const errorColor = useColor("error");
  const successColor = useColor("successGreen");
  const primaryColor = useColor("primary");
  const outlineVariantColor = useColor("outlineVariant");
  const iconBgColor = useColor("primary");

  const title = getDisplayTitle(item);
  const subtitle = getDisplaySubtitle(item);
  const isTransfer = item.transaction_type === "TRANSFER";
  const fromName = item.from_account?.account_name;
  const toName = item.to_account?.account_name;
  const amountColor = isTransfer
    ? onSurfaceColor
    : item.transaction_type === "EXPENSE"
      ? errorColor
      : successColor;
  const amountPrefix = isTransfer
    ? ""
    : item.transaction_type === "EXPENSE"
      ? "-"
      : "+";
  const { formatCurrency } = useFormatCurrency();

  const timeStr = formatTime(item.created_at);
  const metaParts = [subtitle, fromName, timeStr].filter(Boolean);
  const metaText = metaParts.join(" • ");

  return (
    <TouchableOpacity
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast && styles.rowLast,
        !isLast && { borderBottomColor: outlineVariantColor + "1a", borderBottomWidth: 1 },
        { backgroundColor: cardColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: iconBgColor + "1a" }]}>
          <MaterialIcons
            name={getIcon(item.category, item.transaction_type) as any}
            size={20}
            color={primaryColor}
          />
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.name, { color: onSurfaceColor }]} numberOfLines={1}>
            {title}
          </Text>
          {isTransfer && fromName && toName ? (
            <View style={styles.transferRow}>
              <View style={styles.transferAccount}>
                <Text style={[styles.transferLabel, { color: onSurfaceVariantColor }]}>
                  Dari
                </Text>
                <Text style={[styles.transferName, { color: onSurfaceVariantColor }]} numberOfLines={1}>
                  {fromName}
                </Text>
              </View>
              <MaterialIcons
                name="trending-flat"
                size={14}
                color={onSurfaceVariantColor}
                style={styles.transferArrow}
              />
              <View style={styles.transferAccount}>
                <Text style={[styles.transferLabel, { color: onSurfaceVariantColor }]}>
                  Ke
                </Text>
                <Text style={[styles.transferName, { color: onSurfaceVariantColor }]} numberOfLines={1}>
                  {toName}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.meta, { color: onSurfaceVariantColor }]} numberOfLines={1}>
              {metaText}
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
    alignItems: "center",
    justifyContent: "center",
  },
  name: { ...typography.bodyLg, fontWeight: "600" },
  meta: { ...typography.bodySm },
  amount: { ...typography.titleMd, fontSize: 16 },
  transferRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  transferAccount: { flexShrink: 1 },
  transferLabel: {
    ...typography.labelCaps,
    fontSize: 9,
    marginRight: 4,
  },
  transferName: {
    ...typography.bodySm,
    marginRight: 6,
  },
  transferArrow: { marginHorizontal: 2 },
});
