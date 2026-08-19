import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  colors,
  radius,
  shadow,
  spacing,
  typography,
} from "../constants/theme";

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["000", "0", "backspace"],
];

// TODO: sesuaikan value ini dengan value enum "transaction_type" di DB kamu
const TRANSACTION_TYPES = [
  { key: "EXPENSE", label: "Expense", icon: "arrow-upward" },
  { key: "INCOME", label: "Income", icon: "arrow-downward" },
] as const;

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionScreen() {
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [transactionType, setTransactionType] =
    useState<(typeof TRANSACTION_TYPES)[number]["key"]>("EXPENSE");
  const [date, setDate] = useState(todayISO());
  const [transaction, setTransaction] = useState("");

  const isValid =
    parseFloat(amount) > 0 && categoryId !== null && accountId !== null;

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
    queryKey: ["category_transaction"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_transaction")
        .select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // --- Accounts milik user yang lagi login ---
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data, error } = await supabase.from("account").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // Default-kan ke rekening pertama begitu data account selesai dimuat
  useEffect(() => {
    if (accounts && accounts.length > 0 && accountId === null) {
      setAccountId(accounts[0].id);
    }
  }, [accounts]);

  // --- Insert transaksi ---
  const { mutate: saveTransaction, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User belum login");

      const { error } = await supabase.from("transaction").insert({
        amount: parseFloat(amount),
        transaction, // deskripsi/nama transaksi
        transaction_type: transactionType,
        category_id: categoryId,
        account_id: accountId,
        user_id: user.id, // WAJIB — dicek oleh RLS policy (auth.uid() = user_id)
        created_at: new Date(date).toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      // Refresh query transaksi/dashboard yang bergantung pada data ini
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      console.log("Transaksi berhasil disimpan.");
      Alert.alert("Tersimpan", "Transaksi berhasil disimpan.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    },
    onError: (error: any) => {
      console.error("Gagal menyimpan transaksi:", error);
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
        <ScrollView
          style={styles.topScroll}
          contentContainerStyle={styles.topScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount display */}
          <View style={styles.amountBlock}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.amountValue}>
                {amount.length > 0 ? amount : "0"}
              </Text>
            </View>
          </View>

          {/* Transaction type toggle */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeRow}>
              {TRANSACTION_TYPES.map((t) => {
                const active = transactionType === t.key;
                return (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setTransactionType(t.key)}
                    style={[
                      styles.typeButton,
                      active && styles.typeButtonActive,
                    ]}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={t.icon as any}
                      size={16}
                      color={active ? colors.white : colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        active && styles.typeButtonTextActive,
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Category */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {isLoadingCategory ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>Loading categories...</Text>
                </View>
              ) : (
                categories?.map((cat) => {
                  const active = categoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategoryId(cat.id)}
                      style={[
                        styles.categoryChip,
                        active && styles.categoryChipActive,
                      ]}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons
                        name={cat.icon as any}
                        size={16}
                        color={active ? colors.white : colors.secondary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          active && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat.category}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          </View>

          {/* Account */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Account</Text>
            {isLoadingAccounts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>Loading accounts...</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {accounts?.map((acc) => {
                  const active = accountId === acc.id;
                  return (
                    <TouchableOpacity
                      key={acc.id}
                      onPress={() => setAccountId(acc.id)}
                      style={[
                        styles.accountChip,
                        active && styles.categoryChipActive,
                      ]}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          active && styles.categoryChipTextActive,
                        ]}
                      >
                        {acc.account_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Date */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputSoft}>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.outline}
                style={styles.inputSoftText}
              />
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={colors.outline}
              />
            </View>
          </View>

          {/* Transaction note */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Transaction</Text>
            <TextInput
              value={transaction}
              onChangeText={setTransaction}
              placeholder="What was this for?"
              placeholderTextColor={colors.outline}
              style={styles.inputSoft}
            />
          </View>
        </ScrollView>

        {/* Numeric keypad */}
        <View style={styles.keypad}>
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keypadKey}
                  activeOpacity={0.6}
                  onPress={() => handleKeyPress(key)}
                >
                  {key === "backspace" ? (
                    <MaterialIcons
                      name="backspace"
                      size={20}
                      color={colors.onSurfaceVariant}
                    />
                  ) : (
                    <Text style={styles.keypadKeyText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!isValid || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isValid || isSaving}
          activeOpacity={0.9}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.saveButtonText}>Save Transaction</Text>
              <MaterialIcons
                name="check-circle"
                size={20}
                color={colors.white}
              />
            </>
          )}
        </TouchableOpacity>
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

  amountBlock: { alignItems: "center", paddingVertical: 4 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginRight: 4,
  },
  amountValue: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.primary,
    maxWidth: "100%",
  },

  fieldBlock: {},

  typeRow: { flexDirection: "row", gap: 8 },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadow.card,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  typeButtonTextActive: { color: colors.white },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: 8,
    columnGap: "2.5%",
  },
  categoryChip: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    width: "18%",
    ...shadow.card,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurface,
  },
  categoryChipTextActive: { color: colors.white },

  accountChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadow.card,
  },

  inputSoft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputSoftText: { ...typography.bodyLg, color: colors.primary, flex: 1 },

  keypad: { paddingHorizontal: spacing.marginMobile, paddingTop: 4, gap: 8 },
  keypadRow: { flexDirection: "row", gap: 8 },
  keypadKey: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  keypadKeyText: {
    ...typography.titleMd,
    fontSize: 20,
    color: colors.onSurface,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "100%",
    gap: 8,
  },
  loadingText: { fontSize: 14, color: colors.secondary },

  footer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    backgroundColor: colors.background,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, color: colors.white },
});
