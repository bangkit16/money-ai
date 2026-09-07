import { useState, useCallback, useEffect } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  AddTransactionService,
  type TransactionType,
} from "@/services/addTransactionService";
import { invalidateAfterDelete, invalidateTransactionCaches } from "@/lib/query-invalidation";
import { QueryKeys } from "@/lib/query-keys";
import type { TransactionTypeKey } from "@/components/features/transaction/type-toggle";
import { useT } from "@/i18n";

type LoadedTx = {
  id: number;
  created_at: string;
  transaction: string | null;
  amount: number;
  transaction_type: TransactionType | "TRANSFER";
  category_id: number | null;
  account_id: number | null;
  to_account_id: number | null;
  category: { id: number; category: string; category_en: string | null; slug: string; icon: string } | null;
  account: { id: number; account_name: string } | null;
};

export type TransactionFormState = {
  amount: string;
  categoryId: number | null;
  fromAccountId: number | null;
  toAccountId: number | null;
  transactionType: TransactionTypeKey;
  dateTime: Date;
  transactionName: string;
  hydrated: boolean;
};

export function useTransactionForm(
  editId?: string,
  prefilledType?: TransactionTypeKey,
) {
  const queryClient = useQueryClient();
  const t = useT();
  const isEdit = !!editId;

  // --- Form State ---
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [fromAccountId, setFromAccountId] = useState<number | null>(null);
  const [toAccountId, setToAccountId] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionTypeKey>(
    () => prefilledType ?? "EXPENSE",
  );
  const [dateTime, setDateTime] = useState(new Date());
  const [transactionName, setTransactionName] = useState("");
  const [hydrated, setHydrated] = useState(!isEdit);

  // --- Load existing transaction for edit ---
  const { data: existing, isLoading: isLoadingTx, error: txError } = useQuery({
    queryKey: QueryKeys.transaction(editId!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transaction")
        .select(
          "id, created_at, transaction_date, transaction, amount, transaction_type, category_id, account_id, to_account_id, category:category_transaction(id, category, category_en, slug, icon), from_account:account!account_id(id, account_name), to_account:account!to_account_id(id, account_name)",
        )
        .eq("id", Number(editId))
        .single();
      if (error) throw new Error(error.message);
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

  // Hydrate form state once when the async query resolves.
  // Correct pattern: external async data → local editable form state.
  useEffect(() => {
    if (!existing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: bridge query result to form state
    setAmount(String(existing.amount));
    setCategoryId(existing.category_id ?? null);
    setFromAccountId(existing.account_id ?? null);
    setToAccountId(existing.to_account_id ?? null);
    setTransactionType(
      (existing.transaction_type as TransactionTypeKey) ?? "EXPENSE",
    );
    setDateTime(new Date(existing.created_at));
    setTransactionName(existing.transaction ?? "");
    setHydrated(true);
  }, [existing]);

  // --- Categories ---
  const categoryKey: TransactionType = transactionType;
  const { data: categories, isLoading: isLoadingCategory } = useQuery({
    queryKey: QueryKeys.categories(categoryKey),
    queryFn: () => AddTransactionService.GetCategories(categoryKey),
  });

  // --- Accounts ---
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: QueryKeys.accounts,
    queryFn: AddTransactionService.GetAccountOptions,
  });

  // --- Derived ---
  const isTransfer = transactionType === "TRANSFER";
  const isValid = isTransfer
    ? parseFloat(amount) > 0 &&
      fromAccountId !== null &&
      toAccountId !== null &&
      fromAccountId !== toAccountId
    : parseFloat(amount) > 0 && categoryId !== null;

  // --- Save mutation ---
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
      invalidateTransactionCaches(queryClient);
      if (editId) queryClient.invalidateQueries({ queryKey: QueryKeys.transaction(editId) });
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

  // --- Delete mutation ---
  const { mutate: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: () => {
      if (!editId) throw new Error("No transaction id");
      return AddTransactionService.DeleteTransaction(Number(editId));
    },
    onSuccess: () => {
      if (editId) invalidateAfterDelete(queryClient, Number(editId));
      router.back();
      Alert.alert(t("add.deleted"), t("add.deletedMsg"), [{ text: t("common.ok") }]);
    },
    onError: (error: Error) => {
      Alert.alert(t("add.deleteError"), error.message ?? t("add.saveGenericError"));
    },
  });

  // --- Keypad handler ---
  const handleKeyPress = useCallback((key: string) => {
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
  }, [amount]);

  return {
    // State
    amount,
    setAmount,
    categoryId,
    setCategoryId,
    fromAccountId,
    setFromAccountId,
    toAccountId,
    setToAccountId,
    transactionType,
    setTransactionType,
    dateTime,
    setDateTime,
    transactionName,
    setTransactionName,
    hydrated,

    // Queries
    categories,
    isLoadingCategory,
    accounts,
    isLoadingAccounts,
    existing,
    isLoadingTx,
    txError,

    // Validation
    isValid,
    isTransfer,

    // Mutations
    saveTransaction,
    isSaving,
    deleteTransaction,
    isDeleting,

    // Actions
    handleKeyPress,
  };
}
