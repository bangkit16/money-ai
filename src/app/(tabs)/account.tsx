import { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "../../constants/theme";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

type AccountType = "bank" | "ewallet" | "investment";

type Account = {
  id: string;
  name: string;
  numberMasked: string;
  type: AccountType;
  balance: number;
  icon: string;
  isPrimary?: boolean;
};

// TODO: ganti dummy data ini dengan data asli (state global / API)
const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Chase Total Checking",
    numberMasked: "•••• 4821",
    type: "bank",
    balance: 12450.75,
    icon: "account-balance",
    isPrimary: true,
  },
  {
    id: "2",
    name: "Chase Savings",
    numberMasked: "•••• 0093",
    type: "bank",
    balance: 45890.2,
    icon: "savings",
  },
  {
    id: "3",
    name: "GoPay",
    numberMasked: "0812-xxxx-221",
    type: "ewallet",
    balance: 850.0,
    icon: "account-balance-wallet",
  },
  {
    id: "4",
    name: "OVO",
    numberMasked: "0812-xxxx-221",
    type: "ewallet",
    balance: 320.5,
    icon: "account-balance-wallet",
  },
  {
    id: "5",
    name: "Fidelity Brokerage",
    numberMasked: "•••• 7710",
    type: "investment",
    balance: 358550.0,
    icon: "trending-up",
  },
];

const TYPE_META: Record<AccountType, { label: string; color: string }> = {
  bank: { label: "Bank Accounts", color: colors.primary },
  ewallet: { label: "E-Wallets", color: colors.secondary },
  investment: { label: "Investments", color: colors.onTertiaryContainer },
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function AccountScreen() {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);

  const totalBalance = useMemo(
    () => accounts.reduce((sum, acc) => sum + acc.balance, 0),
    [accounts],
  );

  const grouped = useMemo(() => {
    const types: AccountType[] = ["bank", "ewallet", "investment"];
    return types
      .map((type) => ({
        type,
        meta: TYPE_META[type],
        data: accounts.filter((a) => a.type === type),
        subtotal: accounts
          .filter((a) => a.type === type)
          .reduce((sum, a) => sum + a.balance, 0),
      }))
      .filter((group) => group.data.length > 0);
  }, [accounts]);

  const handleSetPrimary = (id: string) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isPrimary: a.id === id })));
  };

  const handleDelete = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const openAccountOptions = (account: Account) => {
    Alert.alert(account.name, "Kelola rekening ini", [
      {
        text: account.isPrimary ? "Sudah Rekening Utama" : "Jadikan Utama",
        onPress: () => handleSetPrimary(account.id),
      },
      {
        text: "Edit",
        // onPress: () => router.push(`/edit-account?id=${account.id}`),
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            "Hapus Rekening",
            `Yakin ingin menghapus "${account.name}"?`,
            [
              { text: "Batal", style: "cancel" },
              {
                text: "Hapus",
                style: "destructive",
                onPress: () => handleDelete(account.id),
              },
            ],
          ),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total balance hero card */}
        <View style={[styles.card, styles.heroCard, shadow.heroCard]}>
          <Text style={styles.heroLabel}>TRANSFER SALDO</Text>
          <View style={styles.heroDivider} />
          <Button
            variant='default'
            onPress={() => {}}
            style={styles.buttonTransfer}
          >
            <Text style={styles.buttonTransferText}>Transfer Antar Rekening</Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </Button>
        </View>

        {/* Account groups */}
        {grouped.map((group) => (
          <View key={group.type} style={{ gap: 16 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.titleMd}>{group.meta.label}</Text>
              <Text style={styles.mutedLabel}>
                {formatCurrency(group.subtotal)}
              </Text>
            </View>

            <View style={[styles.card, shadow.card, { padding: 0 }]}>
              {group.data.map((account, i) => (
                <TouchableOpacity
                  key={account.id}
                  onPress={() => openAccountOptions(account)}
                  activeOpacity={0.7}
                  style={[
                    styles.accountRow,
                    i !== group.data.length - 1 && styles.accountRowDivider,
                  ]}
                >
                  <View style={styles.accountLeft}>
                    <View
                      style={[
                        styles.accountIconCircle,
                        { backgroundColor: group.meta.color + "1a" },
                      ]}
                    >
                      <MaterialIcons
                        name={account.icon as any}
                        size={20}
                        color={group.meta.color}
                      />
                    </View>
                    <View>
                      <View style={styles.accountNameRow}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        {account.isPrimary && (
                          <View style={styles.primaryBadge}>
                            <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.accountMeta}>
                        {account.numberMasked}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.accountRight}>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </Text>
                    <MaterialIcons
                      name="more-vert"
                      size={20}
                      color={colors.outline}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Add account button */}
        <TouchableOpacity
          style={styles.addAccountButton}
          // onPress={() => router.push("/add-account")}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name="add-circle-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.addAccountText}>Add New Account</Text>
        </TouchableOpacity>
      </ScrollView>
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
  buttonTransfer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#014e25",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  buttonTransferText: {
    ...typography.bodyLg,
    color: colors.white,
  },  
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 60,
    gap: spacing.gutter,
  },

  pageTitle: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginBottom: 4,
  },
  pageSubtitle: { ...typography.bodyLg, color: colors.onSurfaceVariant },

  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  titleMd: { ...typography.titleMd, color: colors.onSurface },
  mutedLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },

  heroCard: { backgroundColor: colors.primary },
  heroLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.6)" },
  heroAmount: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.white,
    marginTop: 4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 20,
  },
  heroBreakdownRow: { flexDirection: "row", flexWrap: "wrap", gap: 20 },
  heroBreakdownItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroDot: { width: 8, height: 8, borderRadius: radius.full },
  heroBreakdownLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
  },
  heroBreakdownValue: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.white,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  accountNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  primaryBadge: {
    backgroundColor: colors.tertiaryFixed,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    ...typography.labelCaps,
    fontSize: 9,
    color: colors.onTertiaryContainer,
  },
  accountRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  accountBalance: {
    ...typography.titleMd,
    fontSize: 16,
    color: colors.onSurface,
  },

  addAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    paddingVertical: 18,
  },
  addAccountText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.primary,
  },
});
