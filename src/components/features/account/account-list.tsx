import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import type { AccountRow } from "@/services/accountService";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type AccountListProps = {
  accounts: AccountRow[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onSelectOptions: (account: AccountRow) => void;
};

export function AccountList({
  accounts,
  isLoading,
  error,
  onSelectOptions,
}: AccountListProps) {
  const { formatCurrencySigned } = useFormatCurrency();
  const cardColor = useColor("card");
  const primaryColor = useColor("primary");
  const errorColor = useColor("error");
  const successColor = useColor("successGreen");
  const outlineColor = useColor("outline");
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const dividerColor = useColor("surfaceContainerHighest");
  const onSurfaceColor = useColor("onSurface");
  const iconBgColor = useColor("primary");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={primaryColor} />
        <Text style={[styles.loadingText, { color: onSurfaceVariantColor }]}>
          Loading accounts...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text style={[styles.errorText, { color: errorColor }]}>
        Gagal memuat rekening: {(error as Error).message}
      </Text>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Text style={[styles.emptyText, { color: onSurfaceVariantColor }]}>
        Belum ada rekening. Tambahkan yang pertama.
      </Text>
    );
  }

  return (
    <View style={[styles.card, shadow.card, { padding: 0, backgroundColor: cardColor }]}>
      {accounts.map((account, i) => (
        <View
          key={account.id}
          style={[
            styles.accountRow,
            i !== accounts.length - 1 && { borderBottomColor: dividerColor, borderBottomWidth: 1 },
          ]}
        >
          <View style={styles.accountLeft}>
            <View style={[styles.accountIconCircle, { backgroundColor: iconBgColor + "1a" }]}>
              <MaterialIcons
                name="account-balance"
                size={20}
                color={primaryColor}
              />
            </View>
            <View>
              <Text style={[styles.accountName, { color: onSurfaceColor }]}>
                {account.account_name}
              </Text>
              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      account.total_amount < 0
                        ? errorColor
                        : successColor,
                  },
                ]}
              >
                {formatCurrencySigned(account.total_amount)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onSelectOptions(account)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.optionsButton}
          >
            <MaterialIcons name="more-vert" size={20} color={outlineColor} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 24 },
  amount: { ...typography.titleMd, fontSize: 16 },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  loadingText: { ...typography.bodySm },
  errorText: { ...typography.bodySm, textAlign: "center" },
  emptyText: {
    ...typography.bodyLg,
    textAlign: "center",
    paddingVertical: 24,
  },

  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  accountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  accountIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  accountName: {
    ...typography.bodyLg,
    fontWeight: "600",
  },
  optionsButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
