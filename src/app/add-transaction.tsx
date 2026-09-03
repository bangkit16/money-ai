// migrated to useColor
import { AccountChips } from "@/components/features/add-transaction/account-chips";
import { AmountDisplay } from "@/components/features/add-transaction/amount-display";
import { CategoryGrid } from "@/components/features/add-transaction/category-grid";
import { Keypad } from "@/components/features/add-transaction/keypad";
import { SaveButton } from "@/components/features/add-transaction/save-button";
import { TransactionDateFields } from "@/components/features/add-transaction/transaction-date-fields";
import {
  TypeToggle,
  type TransactionTypeKey,
} from "@/components/features/transaction/type-toggle";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { AccountService } from "@/services/accountService";
import {
  AddTransactionService,
  type TransactionType,
} from "@/services/addTransactionService";
import { ActivityService } from "@/services/activityService";
import { AnalyticsService } from "@/services/analyticsService";
import { DashboardService } from "@/services/dashboardService";
import { supabase } from "@/lib/supabase";
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

type LoadedTx = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType | "TRANSFER";
  category_id: number | null;
  account_id: number | null;
  to_account_id: number | null;
  category: { id: number; category: string; slug: string } | null;
  account: { id: number; account_name: string } | null;
};

export default function TransactionScreen() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ id?: string; type?: string }>();
  const editId = typeof params.id === "string" ? params.id : undefined;
  const isEdit = !!editId;
  const t = useT();

  const entrance = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const bgColor = useColor("background");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const primaryColor = useColor("primary");
  const errorColor = useColor("error");

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [fromAccountId, setFromAccountId] = useState<number | null>(null);
  const [toAccountId, setToAccountId] = useState<number | null>(null);
  const [transactionType, setTransactionType] =
    useState<TransactionTypeKey>("EXPENSE");
  const [dateTime, setDateTime] = useState(new Date());
  const [transactionName, setTransactionName] = useState("");
  const [hydrated, setHydrated] = useState(!isEdit);

  // Load existing transaction when editing
  const { data: existing, isLoading: isLoadingTx, error: txError } = useQuery({
    queryKey: ["transaction", editId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction")
        .select(
          "id, created_at, transaction_date, transaction, amount, transaction_type, category_id, account_id, to_account_id, category:category_transaction(id, category, slug), from_account:account!account_id(id, account_name), to_account:account!to_account_id(id, account_name)"
        )
        .eq("id", Number(editId))
        .single();
      if (error) throw new Error(error.message);
      // DB enum only has INCOME/EXPENSE — detect transfer via to_account_id
      const raw = data as unknown as LoadedTx & {
        transaction_date?: string;
        from_account?: { id: number; account_name: string } | null;
        to_account?: { id: number; account_name: string } | null;
      };
      return {
        ...raw,
        created_at: raw.transaction_date ?? raw.created_at,
        account: raw.from_account ?? null,
      } as LoadedTx;
    },
    enabled: !!editId,
  });

  // Prefill from ?type= when adding — id is the only source of truth here
  useEffect(() => {
    if (isEdit) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.type === "TRANSFER") setTransactionType("TRANSFER");
    else if (params.type === "INCOME") setTransactionType("INCOME");
    else setTransactionType("EXPENSE");
  }, [params.type, isEdit]);

  // Hydrate form when editing — sync async query result into local form state
  useEffect(() => {
    if (!existing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAmount(String(existing.amount));
    setCategoryId(existing.category_id ?? null);
    setFromAccountId(existing.account_id ?? null);
    setToAccountId(existing.to_account_id ?? null);
    setTransactionType(
      (existing.transaction_type as TransactionTypeKey) ?? "EXPENSE"
    );
    setDateTime(new Date(existing.created_at));
    setTransactionName(existing.transaction ?? "");
    setHydrated(true);
  }, [existing]);

  // TRANSFER uses EXPENSE category set (DB enum has no TRANSFER) — picks the most common type
  const categoryKey: TransactionType = transactionType === "TRANSFER" ? "EXPENSE" : transactionType;
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: AddTransactionService.keys.categories(categoryKey),
    queryFn: () => AddTransactionService.GetCategories(categoryKey),
  });

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: AddTransactionService.keys.accounts,
    queryFn: AddTransactionService.GetAccountOptions,
  });

  const isTransfer = transactionType === "TRANSFER";

  const isValid = isTransfer
    ? parseFloat(amount) > 0 &&
      fromAccountId !== null &&
      toAccountId !== null &&
      fromAccountId !== toAccountId
    : parseFloat(amount) > 0 && categoryId !== null;

  const { mutate: saveTransaction, isPending: isSaving } = useMutation({
    mutationFn: () => {
      const basePayload = {
        amount: parseFloat(amount),
        transaction: transactionName,
        transaction_date: dateTime.toISOString(),
      };
      if (isTransfer) {
        if (fromAccountId === null || toAccountId === null) {
          throw new Error(t("add.fromAccountRequired"));
        }
        const transferPayload = {
          ...basePayload,
          account_id: fromAccountId,
          to_account_id: toAccountId,
          category_id: categoryId,
        };
        if (isEdit && editId) {
          return AddTransactionService.UpdateTransaction(Number(editId), {
            ...transferPayload,
            transaction_type: "TRANSFER",
          });
        }
        return AddTransactionService.InsertTransfer(transferPayload);
      }
      if (categoryId === null) {
        throw new Error(t("add.categoryRequired"));
      }
      if (isEdit && editId) {
        return AddTransactionService.UpdateTransaction(Number(editId), {
          ...basePayload,
          transaction_type: transactionType as TransactionType,
          category_id: categoryId,
          account_id: fromAccountId,
          to_account_id: null,
        });
      }
      return AddTransactionService.InsertTransaction({
        ...basePayload,
        transaction_type: transactionType as TransactionType,
        category_id: categoryId,
        account_id: fromAccountId,
        to_account_id: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ActivityService.keys.transactions });
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      queryClient.invalidateQueries({ queryKey: DashboardService.keys.transactions });
      queryClient.invalidateQueries({
        queryKey: DashboardService.keys.recentTransactions,
      });
      queryClient.invalidateQueries({ queryKey: AnalyticsService.keys.current });
      if (editId) queryClient.invalidateQueries({ queryKey: ["transaction", editId] });
      Alert.alert(
        t("add.saved"),
        isTransfer ? t("add.transferSaved") : t("add.transactionSaved"),
        [{ text: t("common.ok"), onPress: () => router.back() }],
      );
    },
    onError: (error: Error) => {
      Alert.alert(t("add.saveError"), error.message ?? t("add.saveGenericError"));
    },
  });

  const { mutate: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: () => AddTransactionService.DeleteTransaction(Number(editId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ActivityService.keys.transactions });
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      queryClient.invalidateQueries({ queryKey: DashboardService.keys.transactions });
      queryClient.invalidateQueries({
        queryKey: DashboardService.keys.recentTransactions,
      });
      queryClient.invalidateQueries({ queryKey: AnalyticsService.keys.current });
      if (editId) queryClient.invalidateQueries({ queryKey: ["transaction", editId] });
      router.back();
      Alert.alert(t("add.deleted"), t("add.deletedMsg"), [{ text: t("common.ok") }]);
    },
    onError: (error: Error) => {
      Alert.alert(t("add.deleteError"), error.message ?? t("add.saveGenericError"));
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
    saveTransaction();
  };

  const handleDelete = () => {
    Alert.alert(t("add.deleteConfirmTitle"), t("add.deleteConfirmMsg"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => deleteTransaction() },
    ]);
  };

  if (isEdit && isLoadingTx) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.loadingText, { color: textMutedColor }]}>{t("add.loading")}</Text>
      </View>
    );
  }
  if (isEdit && (txError || !existing)) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.loadingText, { color: textMutedColor }]}>
          {txError ? t("add.txError", { message: (txError as Error).message }) : t("add.loadError")}
        </Text>
      </View>
    );
  }
  if (isEdit && !hydrated) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: bgColor }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View
        style={[
          styles.screen,
          {
            backgroundColor: bgColor,
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.headerBtn}
          >
            <MaterialIcons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: primaryColor }]}>
            {isEdit
              ? t("add.editTitle")
              : isTransfer
                ? t("add.transferTitle")
                : t("add.newTitle")}
          </Text>
          {isEdit ? (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDeleting}
              hitSlop={10}
              style={styles.headerBtn}
            >
              <MaterialIcons
                name="delete"
                size={24}
                color={isDeleting ? textMutedColor : errorColor}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerBtn} />
          )}
        </View>

        <View style={styles.body}>
          <ScrollView
            style={styles.topScroll}
            contentContainerStyle={styles.topScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AmountDisplay amount={amount} />

            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: textMutedColor }]}>{t("add.type")}</Text>
              <TypeToggle
                value={transactionType}
                onChange={setTransactionType}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: textMutedColor }]}>{t("add.category")}</Text>
              <CategoryGrid
                categories={categories}
                selectedId={categoryId}
                isLoading={isLoadingCategory}
                onSelect={setCategoryId}
              />
            </View>

            {isTransfer ? (
              <View style={styles.transferAccountsRow}>
                <View style={styles.transferAccountCol}>
                  <Text style={[styles.label, { color: textMutedColor }]}>{t("add.from")}</Text>
                  <AccountChips
                    accounts={accounts}
                    selectedId={fromAccountId}
                    isLoading={isLoadingAccounts}
                    onSelect={(id) =>
                      setFromAccountId((prev) => {
                        if (prev === id) return null;
                        if (id === toAccountId) setToAccountId(null);
                        return id;
                      })
                    }
                  />
                </View>
                <View style={styles.transferArrow}>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color={textMutedColor}
                  />
                </View>
                <View style={styles.transferAccountCol}>
                  <Text style={[styles.label, { color: textMutedColor }]}>{t("add.to")}</Text>
                  <AccountChips
                    accounts={accounts}
                    selectedId={toAccountId}
                    isLoading={isLoadingAccounts}
                    onSelect={(id) =>
                      setToAccountId((prev) => {
                        if (prev === id) return null;
                        if (id === fromAccountId) setFromAccountId(null);
                        return id;
                      })
                    }
                  />
                </View>
              </View>
            ) : (
              <View style={styles.fieldBlock}>
                <Text style={[styles.label, { color: textMutedColor }]}>{t("add.account")}</Text>
                <AccountChips
                  accounts={accounts}
                  selectedId={fromAccountId}
                  isLoading={isLoadingAccounts}
                  onSelect={(id) =>
                    setFromAccountId((prev) => (prev === id ? null : id))
                  }
                />
              </View>
            )}
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

        <View style={[styles.footer, { backgroundColor: bgColor }]}>
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
  screen: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { ...typography.bodyLg },

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
  headerTitle: { ...typography.titleMd },

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
    marginBottom: 8,
  },
  fieldBlock: {},
  transferAccountsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  transferAccountCol: { flex: 1, minWidth: 0 },
  transferArrow: { paddingBottom: 12 },

  keypadWrap: { paddingHorizontal: spacing.marginMobile },

  footer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
  },
});