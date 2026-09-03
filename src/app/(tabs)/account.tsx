// migrated to useColor
import { AccountFormModal } from "@/components/features/account/account-form-modal";
import { AccountList } from "@/components/features/account/account-list";
import { AccountOptionsSheet } from "@/components/features/account/account-options-sheet";
import { AddAccountButton } from "@/components/features/account/add-account-button";
import { TransferCard } from "@/components/features/account/transfer-card";
import { AppBar } from "@/components/features/shared/app-bar";
import { ConfirmDialog } from "@/components/features/shared/confirm-dialog";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { AccountService, type AccountRow } from "@/services/accountService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AccountScreen() {
  const queryClient = useQueryClient();
  const t = useT();

  const [formVisible, setFormVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountRow | null>(null);
  const [accountNameInput, setAccountNameInput] = useState("");

  const bgColor = useColor("background");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");

  const [optionsAccount, setOptionsAccount] = useState<AccountRow | null>(null);
  const [deleteConfirmAccount, setDeleteConfirmAccount] =
    useState<AccountRow | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery<AccountRow[]>({
    queryKey: ["accounts"],
    queryFn: AccountService.GetAccountsWithTotals,
  });

  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationFn: AccountService.CreateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      closeForm();
    },
    onError: (err: Error) =>
      setErrorMessage(err.message ?? t("account.errorCreate")),
  });

  const { mutate: updateAccount, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, accountName }: { id: number; accountName: string }) =>
      AccountService.UpdateAccount(id, accountName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      closeForm();
    },
    onError: (err: Error) =>
      setErrorMessage(err.message ?? t("account.errorUpdate")),
  });

  const { mutate: deleteAccount } = useMutation({
    mutationFn: AccountService.DeleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AccountService.keys.all });
      setDeleteConfirmAccount(null);
    },
    onError: (err: Error) => {
      setDeleteConfirmAccount(null);
      setErrorMessage(err.message ?? t("account.errorDelete"));
    },
  });

  const openCreateForm = () => {
    setEditingAccount(null);
    setAccountNameInput("");
    setFormVisible(true);
  };

  const openEditForm = (account: AccountRow) => {
    setEditingAccount(account);
    setAccountNameInput(account.account_name);
    setFormVisible(true);
  };

  const closeForm = () => {
    setFormVisible(false);
    setEditingAccount(null);
    setAccountNameInput("");
  };

  const handleSubmitForm = () => {
    const trimmed = accountNameInput.trim();
    if (!trimmed) return;

    if (editingAccount) {
      updateAccount({ id: editingAccount.id, accountName: trimmed });
    } else {
      createAccount(trimmed);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmAccount) deleteAccount(deleteConfirmAccount.id);
  };

  const isSubmitting = isCreating || isUpdating;
  const count = accounts?.length ?? 0;

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TransferCard />

        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.titleMd, { color: textColor }]}>{t("account.myAccounts")}</Text>
          <Text style={[styles.mutedLabel, { color: textMutedColor }]}>
            {t("account.count", {
              count,
              plural: count === 1 ? "" : "s",
            })}
          </Text>
        </View>

        <AccountList
          accounts={accounts}
          isLoading={isLoading}
          error={error as Error | null}
          onSelectOptions={(account) => setOptionsAccount(account)}
        />

        <AddAccountButton onPress={openCreateForm} />
      </ScrollView>

      <AccountFormModal
        visible={formVisible}
        editingAccount={editingAccount}
        nameInput={accountNameInput}
        onChangeName={setAccountNameInput}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={handleSubmitForm}
      />

      <AccountOptionsSheet
        account={optionsAccount}
        onClose={() => setOptionsAccount(null)}
        onEdit={openEditForm}
        onDelete={(account) => setDeleteConfirmAccount(account)}
      />

      <ConfirmDialog
        visible={!!deleteConfirmAccount}
        title={t("account.deleteAccountTitle")}
        message={t("account.deleteAccountMsg", {
          name: deleteConfirmAccount?.account_name ?? "",
        })}
        onClose={() => setDeleteConfirmAccount(null)}
        onConfirm={confirmDelete}
        confirmLabel={t("account.deleteAccountBtn")}
      />

      <ConfirmDialog
        visible={!!errorMessage}
        title={t("account.errorTitle")}
        message={errorMessage ?? ""}
        onClose={() => setErrorMessage(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 60,
    gap: spacing.gutter,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleMd: { ...typography.titleMd },
  mutedLabel: { ...typography.labelCaps },
});