import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useT } from "@/i18n";
import { CURRENCIES, useSettings } from "@/providers/settings-provider";
import type { AccountRow } from "@/services/accountService";
import { categories$ } from "@/store/categories$";
import { transactionActions } from "@/store/transactions$";
import { formatAmountInput, unformatAmountInput } from "@/utils/formatAmountInput";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
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

const ANIMATION_DURATION = 250;

type AdjustBalanceModalProps = {
  visible: boolean;
  account: AccountRow | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AdjustBalanceModal({
  visible,
  account,
  onClose,
  onSuccess,
}: AdjustBalanceModalProps) {
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const mutedBgColor = useColor("muted");
  const primaryColor = useColor("primary");
  const whiteColor = useColor("background");
  const successColor = useColor("successGreen");
  const errorColor = useColor("error");
  const onSurfaceColor = useColor("onSurface");

  const t = useT();
  const toast = useToast();
  const { currency } = useSettings();
  const { formatCurrencySigned } = useFormatCurrency();
  const currencySymbol =
    CURRENCIES.find((c) => c.code === currency)?.symbol ?? "Rp";

  const [rawInput, setRawInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (visible && account) {
      // Pre-fill input with current amount or empty
      setRawInput(account.total_amount > 0 ? String(account.total_amount) : "");
      setNoteInput("");
    }
  }, [visible, account]);

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
  }, [visible, mounted, backdropOpacity, sheetTranslateY]);

  const currentBalance = account?.total_amount ?? 0;
  const newBalance = Number(unformatAmountInput(rawInput)) || 0;
  const difference = newBalance - currentBalance;
  const hasChanged = rawInput.trim().length > 0 && difference !== 0;

  const handleAmountChange = (text: string) => {
    const unformatted = unformatAmountInput(text);
    setRawInput(unformatted);
  };

  const handleSave = async () => {
    if (!account || !hasChanged || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const absAmount = Math.abs(difference);
      const isIncome = difference > 0;
      const type = isIncome ? "INCOME" : "EXPENSE";

      // Cari kategori penyesuaian / adjustment / others
      const rawCats = categories$.peek() ?? {};
      const catList = Object.values(rawCats);
      const matchedCat =
        catList.find((c) => c.slug === "adjustment" || c.slug === "penyesuaian") ??
        catList.find((c) => c.slug === "others") ??
        null;

      const desc =
        noteInput.trim() ||
        `${t("account.adjustBalance")} (${account.account_name})`;

      transactionActions.create({
        amount: absAmount,
        transaction: desc,
        transaction_type: type,
        category_id: matchedCat?.id ?? null,
        account_id: account.id,
        transaction_date: new Date().toISOString(),
      });

      toast.success(t("account.adjustSuccess"));
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t("account.adjustBalance")}
            </Text>
            <Text style={[styles.accountSubtitle, { color: textMutedColor }]}>
              {account?.account_name}
            </Text>
          </View>

          {/* Saldo Saat Ini */}
          <View style={[styles.infoCard, { backgroundColor: mutedBgColor }]}>
            <Text style={[styles.infoLabel, { color: textMutedColor }]}>
              {t("account.currentBalance")}
            </Text>
            <Text style={[styles.infoAmount, { color: onSurfaceColor }]}>
              {formatCurrencySigned(currentBalance)}
            </Text>
          </View>

          {/* Input Saldo Baru */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              {t("account.newBalance")}
            </Text>
            <View style={[styles.inputWrapper, { backgroundColor: mutedBgColor, borderColor }]}>
              <Text style={[styles.currencyPrefix, { color: primaryColor }]}>
                {currencySymbol}
              </Text>
              <TextInput
                value={formatAmountInput(rawInput)}
                onChangeText={handleAmountChange}
                placeholder="0"
                placeholderTextColor={textMutedColor}
                keyboardType="numeric"
                style={[styles.numericInput, { color: textColor }]}
                autoFocus
              />
            </View>
          </View>

          {/* Preview Selisih */}
          {rawInput.length > 0 && (
            <View style={styles.diffRow}>
              <Text style={[styles.diffLabel, { color: textMutedColor }]}>
                {t("account.difference")}:
              </Text>
              <View style={styles.diffBadge}>
                <MaterialIcons
                  name={difference >= 0 ? "arrow-upward" : "arrow-downward"}
                  size={16}
                  color={difference >= 0 ? successColor : errorColor}
                />
                <Text
                  style={[
                    styles.diffAmount,
                    { color: difference >= 0 ? successColor : errorColor },
                  ]}
                >
                  {difference > 0 ? "+" : ""}
                  {formatCurrencySigned(difference)} (
                  {difference >= 0 ? t("type.income") : t("type.expense")})
                </Text>
              </View>
            </View>
          )}

          {/* Input Catatan Opsional */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: textMutedColor }]}>
              {t("account.adjustReason")} ({t("common.edit")})
            </Text>
            <TextInput
              value={noteInput}
              onChangeText={setNoteInput}
              placeholder={`${t("account.adjustBalance")} (${account?.account_name ?? ""})`}
              placeholderTextColor={textMutedColor}
              style={[styles.noteInput, { color: textColor, backgroundColor: mutedBgColor }]}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor }]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, { color: textMutedColor }]}>
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: primaryColor },
                (!hasChanged || isSubmitting) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!hasChanged || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={whiteColor} />
              ) : (
                <Text style={[styles.saveButtonText, { color: whiteColor }]}>
                  {t("common.save")}
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
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    gap: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    alignSelf: "center",
    marginBottom: 4,
  },
  header: { marginBottom: 4 },
  modalTitle: { ...typography.titleMd },
  accountSubtitle: { ...typography.bodySm, marginTop: 2 },
  infoCard: {
    padding: 12,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { ...typography.labelCaps },
  infoAmount: { ...typography.titleMd, fontSize: 15 },
  inputGroup: { gap: 6 },
  label: { ...typography.labelCaps },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  currencyPrefix: {
    ...typography.headlineLg,
    fontSize: 16,
    marginRight: 6,
    fontWeight: "700",
  },
  numericInput: {
    flex: 1,
    ...typography.headlineLg,
    fontSize: 18,
    paddingVertical: 10,
  },
  noteInput: {
    ...typography.bodyLg,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  diffRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  diffLabel: { ...typography.labelCaps },
  diffBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  diffAmount: { ...typography.bodySm, fontWeight: "600" },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: { ...typography.titleMd, fontSize: 12 },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, fontSize: 12 },
});
