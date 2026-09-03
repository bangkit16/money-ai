// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import type { AccountRow } from "@/services/accountService";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useMemo, useState } from "react";

const ANIMATION_DURATION = 250;

type AccountFormModalProps = {
  visible: boolean;
  editingAccount: AccountRow | null;
  nameInput: string;
  onChangeName: (text: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function AccountFormModal({
  visible,
  editingAccount,
  nameInput,
  onChangeName,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountFormModalProps) {
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const mutedBgColor = useColor("muted");
  const primaryColor = useColor("primary");
  const whiteColor = useColor("background");
  const t = useT();

  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const sheetTranslateY = useMemo(() => new Animated.Value(300), []);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setMounted(true);
    }
  }

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          speed: 30,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 400,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible || mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.modalSheet,
            shadow.heroCard,
            { backgroundColor: cardColor, transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={[styles.modalHandle, { backgroundColor: handleColor }]} />
          <Text style={[styles.modalTitle, { color: textColor }]}>
            {editingAccount ? t("account.editAccount") : t("account.addAccount")}
          </Text>

          <Text style={[styles.label, { color: textMutedColor }]}>{t("account.nameLabel")}</Text>
          <TextInput
            value={nameInput}
            onChangeText={onChangeName}
            placeholder={t("account.namePlaceholder")}
            placeholderTextColor={textMutedColor}
            style={[styles.input, { color: textColor, backgroundColor: mutedBgColor }]}
            autoFocus
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: textMutedColor }]}>{t("common.cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: primaryColor },
                (!nameInput.trim() || isSubmitting) && styles.saveButtonDisabled,
              ]}
              onPress={onSubmit}
              disabled={!nameInput.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={whiteColor} />
              ) : (
                <Text style={[styles.saveButtonText, { color: whiteColor }]}>
                  {editingAccount ? t("account.saveChanges") : t("account.add")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  modalSheet: {
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
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    ...typography.titleMd,
    marginBottom: 4,
  },
  label: { ...typography.labelCaps },
  input: {
    ...typography.bodyLg,
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
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    ...typography.titleMd,
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, fontSize: 15 },
});