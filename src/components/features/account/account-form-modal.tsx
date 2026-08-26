import { Text } from "@/components/ui/text";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";
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
            { transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>
            {editingAccount ? "Edit Account" : "Add New Account"}
          </Text>

          <Text style={styles.label}>Account Name</Text>
          <TextInput
            value={nameInput}
            onChangeText={onChangeName}
            placeholder="e.g. BCA Checking"
            placeholderTextColor={colors.outline}
            style={styles.input}
            autoFocus
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!nameInput.trim() || isSubmitting) && styles.saveButtonDisabled,
              ]}
              onPress={onSubmit}
              disabled={!nameInput.trim() || isSubmitting}
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
});
