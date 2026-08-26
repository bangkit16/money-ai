import { AccountChips } from "@/components/features/add-transaction/account-chips";
import { AmountDisplay } from "@/components/features/add-transaction/amount-display";
import { CategoryGrid } from "@/components/features/add-transaction/category-grid";
import { Keypad } from "@/components/features/add-transaction/keypad";
import { SaveButton } from "@/components/features/add-transaction/save-button";
import {
  TransactionDateFields,
} from "@/components/features/add-transaction/transaction-date-fields";
import {
  TypeToggle,
  type TransactionTypeKey,
} from "@/components/features/add-transaction/type-toggle";
import { Text } from "@/components/ui/text";
import { colors, spacing, typography } from "@/constants/theme";
import {
  AddTransactionService,
  type TransactionType,
} from "@/services/addTransactionService";
import { AccountService } from "@/services/accountService";
import { ActivityService } from "@/services/activityService";
import { DashboardService } from "@/services/dashboardService";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddTransactionScreen() {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [transactionType, setTransactionType] =
    useState<TransactionTypeKey>("EXPENSE");
  const [dateTime, setDateTime] = useState(new Date());
  const [transaction, setTransaction] = useState("");

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (amount.includes(".")) return;
      setAmount((prev) => (prev.length === 0 ? "0." : prev + "."));
      return;
    }
    const decimalPart = amount.split(".")[1];
    if (decimalPart && decimalPart.length >= 2) return;
    if (amount === "0") {
      setAmount(key);
      return;
    }
    setAmount((prev) => prev + key);
  };

  // --- Categories ---
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: AddTransactionService.keys.categories(transactionType),
    queryFn: () => AddTransactionService.GetCategories(transactionType),
  });

  // --- Accounts milik user yang lagi login ---
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: AddTransactionService.keys.accounts,
    queryFn: AddTransactionService.GetAccountOptions,
  });

  const isValid = parseFloat(amount) > 0 && categoryId !== null;

  // --- Insert transaksi ---
  const { mutate: saveTransaction, isPending: isSaving } = useMutation({
    mutationFn: () => {
      if (categoryId === null) {
        throw new Error("Kategori wajib dipilih.");
      }
      return AddTransactionService.InsertTransaction({
        amount: parseFloat(amount),
        transaction, // deskripsi/nama transaksi
        transaction_type: transactionType as TransactionType,
        category_id: categoryId,
        account_id: accountId,
        created_at: dateTime.toISOString(),
      });
    },
    onSuccess: () => {
      // Refresh query transaksi/dashboard yang bergantung pada data ini
      queryClient.invalidateQueries({ queryKey: ActivityService.keys.transactions });
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      queryClient.invalidateQueries({ queryKey: DashboardService.keys.transactions });
      queryClient.invalidateQueries({
        queryKey: DashboardService.keys.recentTransactions,
      });
      Alert.alert("Tersimpan", "Transaksi berhasil disimpan.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: Error) => {
      Alert.alert("Gagal menyimpan", error.message ?? "Terjadi kesalahan.");
    },
  });

  const handleSave = () => {
    if (!isValid) return;
    saveTransaction();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.headerBtn}
        >
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.body}>
        {/* Hanya Amount, Type, Category, Account yang scrollable */}
        <ScrollView
          style={styles.topScroll}
          contentContainerStyle={styles.topScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AmountDisplay amount={amount} />

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Type</Text>
            <TypeToggle value={transactionType} onChange={setTransactionType} />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Category</Text>
            <CategoryGrid
              categories={categories}
              selectedId={categoryId}
              isLoading={isLoadingCategory}
              onSelect={(id) => setCategoryId(id)}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Account</Text>
            <AccountChips
              accounts={accounts}
              selectedId={accountId}
              isLoading={isLoadingAccounts}
              onSelect={(id) => setAccountId((prev) => (prev === id ? null : id))}
            />
          </View>
        </ScrollView>

        <TransactionDateFields
          transaction={transaction}
          onChangeTransaction={setTransaction}
          dateTime={dateTime}
          onChangeDateTime={setDateTime}
        />

        <View style={styles.keypadWrap}>
          <Keypad onKeyPress={handleKeyPress} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <SaveButton
          disabled={!isValid}
          loading={isSaving}
          onPress={handleSave}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.titleMd, color: colors.primary },

  body: { flex: 1 },

  topScroll: { flexGrow: 0 },
  topScrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 16,
  },

  label: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  fieldBlock: {},

  keypadWrap: { paddingHorizontal: spacing.marginMobile },

  footer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    backgroundColor: colors.background,
  },
});
