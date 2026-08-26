import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatCurrencyShort } from "@/utils/formatCurrency";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
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
} from "../../constants/theme";

// Sesuai schema Supabase: id int8, created_at timestamptz, account_name varchar, user_id uuid
type Account = {
  id: number;
  account_name: string;
  created_at: string;
  user_id: string;
};

export default function AccountScreen() {
  const queryClient = useQueryClient();

  const [formVisible, setFormVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountNameInput, setAccountNameInput] = useState("");

  // Bottom sheet opsi (Edit/Hapus) & konfirmasi hapus — pengganti Alert.alert
  // (Alert.alert tidak render apa pun di web, jadi harus pakai UI sendiri)
  const [optionsAccount, setOptionsAccount] = useState<Account | null>(null);
  const [deleteConfirmAccount, setDeleteConfirmAccount] =
    useState<Account | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- READ ---
  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account_with_totals") // Panggil nama view yang dibuat tadi
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data; // 'data' langsung memiliki field total_amount secara otomatis
    },
  });

  console.log(accounts);

  // --- CREATE ---
  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationFn: async (accountName: string) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User belum login");

      const { error } = await supabase
        .from("account")
        .insert({ account_name: accountName, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      closeForm();
    },
    onError: (err: any) =>
      setErrorMessage(err.message ?? "Gagal menambah rekening."),
  });

  // --- UPDATE ---
  const { mutate: updateAccount, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      id,
      accountName,
    }: {
      id: number;
      accountName: string;
    }) => {
      const { error } = await supabase
        .from("account")
        .update({ account_name: accountName })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      closeForm();
    },
    onError: (err: any) =>
      setErrorMessage(err.message ?? "Gagal mengubah rekening."),
  });

  // --- DELETE ---
  const { mutate: deleteAccount } = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("account").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      setDeleteConfirmAccount(null);
    },
    onError: (err: any) => {
      setDeleteConfirmAccount(null);
      setErrorMessage(err.message ?? "Gagal menghapus rekening.");
    },
  });

  const openCreateForm = () => {
    setEditingAccount(null);
    setAccountNameInput("");
    setFormVisible(true);
  };

  const openEditForm = (account: Account) => {
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

  const openAccountOptions = (account: Account) => {
    setOptionsAccount(account);
  };

  const closeOptions = () => setOptionsAccount(null);

  const handleEditFromOptions = () => {
    if (optionsAccount) openEditForm(optionsAccount);
    closeOptions();
  };

  const handleDeleteFromOptions = () => {
    if (optionsAccount) setDeleteConfirmAccount(optionsAccount);
    closeOptions();
  };

  const confirmDelete = () => {
    if (deleteConfirmAccount) deleteAccount(deleteConfirmAccount.id);
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <View style={styles.screen}>
      {/* Top App Bar */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>Dompety</Text>
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
            variant="default"
            onPress={() => {}}
            style={styles.buttonTransfer}
          >
            <Text style={styles.buttonTransferText}>
              Transfer Antar Rekening
            </Text>
            <MaterialIcons name="arrow-forward" size={24} color="white" />
          </Button>
        </View>

        {/* Account list */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.titleMd}>My Accounts</Text>
          <Text style={styles.mutedLabel}>
            {accounts?.length ?? 0} account{accounts?.length === 1 ? "" : "s"}
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Loading accounts...</Text>
          </View>
        ) : error ? (
          <Text style={styles.errorText}>
            Gagal memuat rekening: {(error as Error).message}
          </Text>
        ) : accounts && accounts.length > 0 ? (
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
                    <Text style={styles.accountName}>
                      {account.account_name}
                    </Text>
                    <Text style={styles.accountMeta}>
                      {formatCurrency(account.total_amount)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => openAccountOptions(account)}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={styles.optionsButton}
                >
                  <MaterialIcons
                    name="more-vert"
                    size={20}
                    color={colors.outline}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>
            Belum ada rekening. Tambahkan yang pertama.
          </Text>
        )}

        {/* Add account button */}
        <TouchableOpacity
          style={styles.addAccountButton}
          onPress={openCreateForm}
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

      {/* Modal Create/Edit */}
      <Modal
        visible={formVisible}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeForm}
          />
          <View style={[styles.modalSheet, shadow.heroCard]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {editingAccount ? "Edit Account" : "Add New Account"}
            </Text>

            <Text style={styles.label}>Account Name</Text>
            <TextInput
              value={accountNameInput}
              onChangeText={setAccountNameInput}
              placeholder="e.g. BCA Checking"
              placeholderTextColor={colors.outline}
              style={styles.input}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!accountNameInput.trim() || isSubmitting) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={handleSubmitForm}
                disabled={!accountNameInput.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingAccount ? "Save Changes" : "Add Account"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Bottom sheet: opsi Edit/Hapus (pengganti Alert.alert) */}
      <Modal
        visible={!!optionsAccount}
        transparent
        animationType="slide"
        onRequestClose={closeOptions}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, styles.modalBackdrop]}
          activeOpacity={1}
          onPress={closeOptions}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.optionsSheet, shadow.heroCard]}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.optionsTitle}>
              {optionsAccount?.account_name}
            </Text>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleEditFromOptions}
            >
              <MaterialIcons name="edit" size={20} color={colors.onSurface} />
              <Text style={styles.optionRowText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRow}
              onPress={handleDeleteFromOptions}
            >
              <MaterialIcons
                name="delete-outline"
                size={20}
                color={colors.error}
              />
              <Text style={[styles.optionRowText, { color: colors.error }]}>
                Hapus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCancelRow}
              onPress={closeOptions}
            >
              <Text style={styles.optionCancelText}>Batal</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Konfirmasi hapus (pengganti Alert.alert kedua) */}
      <Modal
        visible={!!deleteConfirmAccount}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmAccount(null)}
      >
        <View style={styles.centerOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.modalTitle}>Hapus Rekening</Text>
            <Text style={styles.confirmText}>
              Yakin ingin menghapus "{deleteConfirmAccount?.account_name}"?
              Tindakan ini tidak bisa dibatalkan.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteConfirmAccount(null)}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.saveButtonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pesan error (pengganti Alert.alert error) */}
      <Modal
        visible={!!errorMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setErrorMessage(null)}
      >
        <View style={styles.centerOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.modalTitle}>Terjadi Kesalahan</Text>
            <Text style={styles.confirmText}>{errorMessage}</Text>
            <TouchableOpacity
              style={[styles.saveButton, { marginTop: 8 }]}
              onPress={() => setErrorMessage(null)}
            >
              <Text style={styles.saveButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonTransferText: { ...typography.bodyLg, color: colors.white },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 60,
    gap: spacing.gutter,
  },

  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  titleMd: { ...typography.titleMd, color: colors.onSurface },
  mutedLabel: { ...typography.labelCaps, color: colors.onSurfaceVariant },

  heroCard: { backgroundColor: colors.primary },
  heroLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.6)" },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 20,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

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

  // Modal
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    gap: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  label: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  input: {
    ...typography.bodyLg,
    color: colors.onSurface,
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, fontSize: 15, color: colors.white },

  // Options bottom sheet
  optionsSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
  },
  optionsTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainerHighest,
  },
  optionRowText: { ...typography.bodyLg, color: colors.onSurface },
  optionCancelRow: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  optionCancelText: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.onSurfaceVariant,
  },

  // Center modal (confirm delete / error)
  centerOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,17,37,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.marginMobile,
  },
  confirmCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
    ...shadow.heroCard,
  },
  confirmText: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
});
