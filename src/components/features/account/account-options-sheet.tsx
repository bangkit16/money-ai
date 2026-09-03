// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
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
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const errorColor = useColor("error");
  const t = useT();

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
          style={[styles.optionsSheet, shadow.heroCard, { backgroundColor: cardColor }]}
        >
          <View style={[styles.modalHandle, { backgroundColor: handleColor }]} />
          <Text style={[styles.optionsTitle, { color: textColor }]}>{account?.account_name}</Text>

          <TouchableOpacity style={[styles.optionRow, { borderTopColor: borderColor }]} onPress={handleEdit}>
            <MaterialIcons name="edit" size={20} color={textColor} />
            <Text style={[styles.optionRowText, { color: textColor }]}>{t("common.edit")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionRow, { borderTopColor: borderColor }]}
            onPress={handleDelete}
          >
            <MaterialIcons
              name="delete-outline"
              size={20}
              color={errorColor}
            />
            <Text style={[styles.optionRowText, { color: errorColor }]}>
              {t("common.delete")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCancelRow} onPress={onClose}>
            <Text style={[styles.optionCancelText, { color: textMutedColor }]}>{t("common.cancel")}</Text>
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
    alignSelf: "center",
    marginBottom: 4,
  },
  optionsTitle: {
    ...typography.titleMd,
    textAlign: "center",
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  optionRowText: { ...typography.bodyLg },
  optionCancelRow: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  optionCancelText: {
    ...typography.titleMd,
    fontSize: 15,
  },
});