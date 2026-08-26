import { Text } from "@/components/ui/text";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
import type { AccountRow } from "@/services/accountService";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from "react-native";

type AccountOptionsSheetProps = {
  account: AccountRow | null;
  onClose: () => void;
  onEdit: (account: AccountRow) => void;
  onDelete: (account: AccountRow) => void;
};

export function AccountOptionsSheet({
  account,
  onClose,
  onEdit,
  onDelete,
}: AccountOptionsSheetProps) {
  const handleEdit = () => {
    if (account) onEdit(account);
    onClose();
  };

  const handleDelete = () => {
    if (account) onDelete(account);
    onClose();
  };

  return (
    <Modal
      visible={!!account}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[styles.modalOverlay, styles.modalBackdrop]}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.optionsSheet, shadow.heroCard]}
        >
          <View style={styles.modalHandle} />
          <Text style={styles.optionsTitle}>{account?.account_name}</Text>

          <TouchableOpacity style={styles.optionRow} onPress={handleEdit}>
            <MaterialIcons name="edit" size={20} color={colors.onSurface} />
            <Text style={styles.optionRowText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleDelete}>
            <MaterialIcons
              name="delete-outline"
              size={20}
              color={colors.error}
            />
            <Text style={[styles.optionRowText, { color: colors.error }]}>
              Hapus
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCancelRow} onPress={onClose}>
            <Text style={styles.optionCancelText}>Batal</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  optionsSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    alignSelf: "center",
    marginBottom: 4,
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
});
