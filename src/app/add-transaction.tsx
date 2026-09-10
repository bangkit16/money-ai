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
import { useTransactionForm } from "@/hooks/useTransactionForm";
import { useT } from "@/i18n";
import { ConfirmDialog } from "@/components/features/shared/confirm-dialog";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useEffect, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TransactionScreen() {
  const params = useLocalSearchParams<{ id?: string; type?: string }>();
  const editId = typeof params.id === "string" ? params.id : undefined;
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

  const prefilledType = (params.type ?? "EXPENSE") as TransactionTypeKey;
  const {
    amount,
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
    categories,
    isLoadingCategory,
    accounts,
    isLoadingAccounts,
    existing,
    isLoadingTx,
    txError,
    isValid,
    isTransfer,
    saveTransaction,
    isSaving,
    deleteTransaction,
    isDeleting,
    handleKeyPress,
  } = useTransactionForm(editId, prefilledType);

  const handleSave = () => {
    if (!isValid) return;
    saveTransaction();
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  if (editId && isLoadingTx) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.loadingText, { color: textMutedColor }]}>{t("add.loading")}</Text>
      </View>
    );
  }
  if (editId && (txError || !existing)) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
        <Text style={[styles.loadingText, { color: textMutedColor }]}>
          {txError ? t("add.txError", { message: (txError as Error).message }) : t("add.loadError")}
        </Text>
      </View>
    );
  }
  if (editId && !hydrated) return null;

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
            {editId
              ? t("add.editTitle")
              : isTransfer
                ? t("add.transferTitle")
                : t("add.newTitle")}
          </Text>
          {editId ? (
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

            <View style={styles.fieldBlock}>
              <Text style={[styles.label, { color: textMutedColor }]}>{t("add.category")}</Text>
              <CategoryGrid
                categories={categories}
                selectedId={categoryId}
                isLoading={isLoadingCategory}
                onSelect={setCategoryId}
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

        <View style={[styles.footer, { backgroundColor: bgColor }]}>
          <SaveButton
            disabled={!isValid}
            loading={isSaving}
            onPress={handleSave}
          />
        </View>
      </Animated.View>
      <ConfirmDialog
        visible={showDeleteConfirm}
        title={t("add.deleteConfirmTitle")}
        message={t("add.deleteConfirmMsg")}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteTransaction}
        confirmLabel={t("common.delete")}
        isConfirming={isDeleting}
      />
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
