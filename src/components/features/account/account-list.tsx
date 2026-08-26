import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import type { AccountRow } from "@/services/accountService";
import { formatCurrencySigned } from "@/utils/formatCurrency";
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
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading accounts...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Text style={styles.errorText}>
        Gagal memuat rekening: {(error as Error).message}
      </Text>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Belum ada rekening. Tambahkan yang pertama.
      </Text>
    );
  }

  return (
    <View style={[styles.card, shadow.card, { padding: 0 }]}>
      {accounts.map((account, i) => (
        <View
          key={account.id}
          style={[
            styles.accountRow,
            i !== accounts.length - 1 && styles.accountRowDivider,
          ]}
        >
          <View style={styles.accountLeft}>
            <View style={styles.accountIconCircle}>
              <MaterialIcons
                name="account-balance"
                size={20}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={styles.accountName}>{account.account_name}</Text>
              <Text
                style={[
                  styles.amount,
                  {
                    color:
                      account.total_amount < 0 
                        ? colors.error
                        : colors.successGreen,
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
            <MaterialIcons name="more-vert" size={20} color={colors.outline} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  amount: { ...typography.titleMd, fontSize: 16 },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  loadingText: { ...typography.bodySm, color: colors.onSurfaceVariant },
  errorText: { ...typography.bodySm, color: colors.error, textAlign: "center" },
  emptyText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    paddingVertical: 24,
  },

  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  accountRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
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
    backgroundColor: colors.primary + "1a",
    alignItems: "center",
    justifyContent: "center",
  },
  accountName: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.onSurface,
  },
  accountMeta: {
    ...typography.bodySm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  optionsButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
