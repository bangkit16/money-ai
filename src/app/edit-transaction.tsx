import { supabase } from "@/lib/supabase";
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
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditTransactionScreen() {
  const queryClient = useQueryClient();

  const { id } = useLocalSearchParams<{ id: string }>();

  const entrance = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  // Fetch transaction data
  const { data: transaction, isLoading: isLoadingTx, error: txError } = useQuery({
    queryKey: ["transaction", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction")
        .select(
          "id, created_at, transaction, amount, transaction_type, category_id, account_id, category:category_transaction(id, category, slug), account:account(id, account_name)"
        )
        .eq("id", parseInt(id))
        .single();
      if (error) throw new Error(error.message);
      return data as unknown as {
        id: number;
        created_at: string;
        transaction: string | null;
        amount: number;
        transaction_type: TransactionType;
        category_id: number | null;
        account_id: number | null;
        category: { id: number; category: string; slug: string } | null;
        account: { id: number; account_name: string } | null;
      };
    },
  });

  // Initialize state with empty defaults, sync when transaction loads
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [transactionType, setTransactionType] =
    useState<TransactionTypeKey>("EXPENSE");
  const [dateTime, setDateTime] = useState(new Date());
  const [transactionName, setTransactionName] = useState("");

  // Sync form state when transaction data loads
  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.amount));
      setCategoryId(transaction.category_id ?? null);
      setAccountId(transaction.account_id ?? null);
      setTransactionType(transaction.transaction_type);
      setDateTime(new Date(transaction.created_at));
      setTransactionName(transaction.transaction ?? "");
    }
  }, [transaction]);

  // --- Categories ---
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: AddTransactionService.keys.categories(transactionType),
    queryFn: () => AddTransactionService.GetCategories(transactionType),
    enabled: !!transactionType,
  });

  // --- Accounts milik user yang lagi login ---
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: AddTransactionService.keys.accounts,
    queryFn: AddTransactionService.GetAccountOptions,
  });

  const isValid = parseFloat(amount) > 0 && categoryId !== null;

  // --- Update transaksi ---
  const { mutate: updateTransaction, isPending: isSaving } = useMutation({
    mutationFn: () => {
      if (categoryId === null) {
        throw new Error("Kategori wajib dipilih.");
      }
      return AddTransactionService.UpdateTransaction(parseInt(id), {
        amount: parseFloat(amount),
        transaction: transactionName,
        transaction_type: transactionType as TransactionType,
        category_id: categoryId,
        account_id: accountId,
        created_at: dateTime.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ActivityService.keys.transactions });
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      queryClient.invalidateQueries({ queryKey: DashboardService.keys.transactions });
      queryClient.invalidateQueries({
        queryKey: DashboardService.keys.recentTransactions,
      });
      Alert.alert("Tersimpan", "Transaksi berhasil diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: Error) => {
      Alert.alert("Gagal menyimpan", error.message ?? "Terjadi kesalahan.");
    },
  });

  // --- Delete transaksi ---
  const { mutate: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: () => AddTransactionService.DeleteTransaction(parseInt(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ActivityService.keys.transactions });
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      queryClient.invalidateQueries({ queryKey: DashboardService.keys.transactions });
      queryClient.invalidateQueries({
        queryKey: DashboardService.keys.recentTransactions,
      });
      router.back();
      Alert.alert("Terhapus", "Transaksi berhasil dihapus.", [
        { text: "OK" },
      ]);
    },
    onError: (error: Error) => {
      Alert.alert("Gagal menghapus", error.message ?? "Terjadi kesalahan.");
    },
  });

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

  const handleSave = () => {
    if (!isValid) return;
    updateTransaction();
  };

  const handleDelete = () => {
    Alert.alert(
      "Hapus Transaksi",
      "Apakah Anda yakin ingin menghapus transaksi ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => deleteTransaction() },
      ]
    );
  };

  if (isLoadingTx) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (txError || !transaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Gagal memuat transaksi</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, styles.screenBackdrop]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View
        style={[
          styles.screen,
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
            ],
          },
        ]}
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
          <Text style={styles.headerTitle}>Edit Transaksi</Text>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            hitSlop={10}
            style={styles.headerBtn}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={isDeleting ? colors.onSurfaceVariant : colors.error}
            />
          </TouchableOpacity>
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
            transaction={transactionName}
            onChangeTransaction={setTransactionName}
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
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenBackdrop: { backgroundColor: colors.background },
  screen: { flex: 1, backgroundColor: colors.background },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: { ...typography.bodyLg, color: colors.onSurfaceVariant },

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