// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import {
  askAi,
  formatQueryResult,
  type AiPromptResult,
  type AiTransactionItem,
  type AiDeleteTarget,
  type AiUpdatePayload,
  formatRupiah,
} from "@/lib/ai";
import { invalidateTransactionCaches } from "@/lib/query-invalidation";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/providers/settings-provider";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import AiPromptBottomSheet from "./ai/AiPromptBottomSheet";
import AiTransactionConfirmModal from "./ai/AiTransactionConfirmModal";
import AiDeleteConfirmModal from "./ai/AiDeleteConfirmModal";
import AiUpdateConfirmModal from "./ai/AiUpdateConfirmModal";
import { useToast } from "./ui/toast";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

type AiButtonProps = {
  // Opsional: id akun sumber transaksi (mis. akun yang lagi aktif di layar).
  // Kalau tidak diisi, komponen otomatis pakai akun pertama milik user.
  accountId?: number;
};

function AiButton({ accountId }: AiButtonProps) {
  const whiteColor = useColor("card");
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const primaryColor = useColor("primary");
  const borderColor = useColor("border");
  const bgColor = useColor("background");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<AiTransactionItem | null>(null);
  const [draftItems, setDraftItems] = useState<AiTransactionItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AiDeleteTarget | null>(null);
  const [updatePayload, setUpdatePayload] = useState<AiUpdatePayload | null>(null);
  const [saving, setSaving] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const queryClient = useQueryClient();
  const t = useT();
  const toast = useToast();
  const { autoSaveTransaction, usePrimaryAccount } = useSettings();
  const {
    isListening,
    transcript,
    start: startListening,
    stop: stopListening,
    supported: speechSupported,
  } = useSpeechRecognition();
  const [voicePrompt, setVoicePrompt] = useState("");
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyPrimaryAccount = async (d: AiTransactionItem) => {
    if (usePrimaryAccount && d.account_id) return d;
    if (!usePrimaryAccount) return d;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return d;
    const { data: primaryAcc } = await supabase
      .from("account")
      .select("id, account_name")
      .eq("user_id", user.id)
      .eq("is_primary", true)
      .single();
    if (!primaryAcc) return d;
    return { ...d, account_id: primaryAcc.id, account_name: primaryAcc.account_name };
  };

  const saveTransaction = async (d: AiTransactionItem) => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const resolved = await applyPrimaryAccount(d);

      const isTransfer = d.transaction_type === "TRANSFER";
      // Validasi transfer: account_id & to_account_id wajib diisi
      if (isTransfer && (!resolved.account_id || !resolved.to_account_id)) {
        throw new Error("Transfer memerlukan rekening sumber dan tujuan.");
      }

      const sourceAccountId = resolved.account_id ?? accountId;

      const { error } = await supabase.from("transaction").insert({
        transaction: resolved.description,
        amount: resolved.amount,
        transaction_type: resolved.transaction_type,
        category_id: resolved.category?.id ?? null,
        account_id: sourceAccountId,
        to_account_id: resolved.to_account_id ?? null,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
      });

      if (error) throw error;

      invalidateTransactionCaches(queryClient);

      toast.success(
        t("add.saved"),
        isTransfer ? t("add.transferSaved") : t("add.transactionSaved"),
      );
    } catch (e: any) {
      const msg = e?.message || "Gagal menyimpan transaksi. Coba lagi.";
      setResultMessage(msg);
      setResultVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (prompt: string) => {
    setVoicePrompt("");
    setOpen(false);
    setLoading(true);
    try {
      const result: AiPromptResult = await askAi(prompt);

      console.log("AI result:",  JSON.stringify(result));

      if (result.action === "confirm_transaction") {
        const items = result.data.items;
        if (items.length === 1) {
          // Single transaction - apply primary account and either auto-save or show modal
          const resolved = await applyPrimaryAccount(items[0]);
          if (autoSaveTransaction) {
            await saveTransaction(resolved);
          } else {
            setDraft(resolved);
          }
        } else {
          // Multiple transactions - show items for user confirmation
          setDraftItems(items);
        }
      } else if (result.action === "show_result") {
        setResultMessage(formatQueryResult(result.tool, result.data));
        setResultVisible(true);
      } else if (result.action === "text_answer") {
        setResultMessage(result.message);
        setResultVisible(true);
      } else if (result.action === "confirm_delete") {
        setDeleteTarget(result.data);
      } else if (result.action === "confirm_update") {
        setUpdatePayload(result.data);
      }
    } catch (e) {
      setResultMessage("Gagal memproses permintaan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Animated values for loading state: logo spin + dot pulse.
  const spinAnim = useMemo(() => new Animated.Value(0), []);
  const dot1 = useMemo(() => new Animated.Value(0), []);
  const dot2 = useMemo(() => new Animated.Value(0), []);
  const dot3 = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (!loading) {
      spinAnim.stopAnimation();
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
      spinAnim.setValue(0);
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
      return;
    }

    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulse = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );

    spin.start();
    pulse(dot1, 0).start();
    pulse(dot2, 200).start();
    pulse(dot3, 400).start();

    return () => {
      spin.stop();
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, [loading, spinAnim, dot1, dot2, dot3]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const dotStyle = (val: Animated.Value) => ({
    opacity: val.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: val.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -3],
        }),
      },
    ],
  });

  // Auto-send 1 second after speech recognition stops with a final transcript
  useEffect(() => {
    if (isListening || !transcript.trim()) return;
    autoSendTimerRef.current = setTimeout(() => {
      const text = transcript.trim();
      if (text) {
        setVoicePrompt("");
        handleSend(text);
      }
    }, 1000);
    return () => {
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    };
  }, [isListening]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVoicePress = () => {
    if (!speechSupported) {
      toast.error("Voice input", "Speech recognition not supported on this platform");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      setVoicePrompt("");
      startListening();
    }
  };

  const handleConfirmTransaction = async () => {
    if (!draft) return;
    await saveTransaction(draft);
    setDraft(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    console.log("Deleting transaction with target:", deleteTarget);
    setSaving(true);
    try {
      const { error } = await supabase
        .from("transaction")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;

      invalidateTransactionCaches(queryClient);
      toast.success(t("common.success"), t("ai.transactionDeleted"));
      setDeleteTarget(null);
    } catch (e) {
      setResultMessage("Gagal menghapus transaksi. Coba lagi.");
      setResultVisible(true);
      setDeleteTarget(null);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!updatePayload) return;
    setSaving(true);
    try {
      // Hanya kirim field yang valid di tabel transaction
      const { category: _category, ...dbChanges } = updatePayload.changes;

      const { error } = await supabase
        .from("transaction")
        .update(dbChanges)
        .eq("id", updatePayload.transaction_id);

      if (error) throw error;

      invalidateTransactionCaches(queryClient);
      toast.success(t("common.success"), t("ai.transactionUpdated"));
      setUpdatePayload(null);
    } catch (e) {
      setResultMessage("Gagal mengubah transaksi. Coba lagi.");
      setResultVisible(true);
      setUpdatePayload(null);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllItems = async () => {
    setSaving(true);
    try {
      for (const item of draftItems) {
        await saveTransaction(item);
      }
      setDraftItems([]);
    } catch (e) {
      // Error already handled in saveTransaction
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSingleItem = async (item: AiTransactionItem) => {
    const resolved = await applyPrimaryAccount(item);
    await saveTransaction(resolved);
    setDraftItems((prev) => prev.filter((_, i) => i !== 0));
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.fabContainer,
          loading && styles.fabLoading,
          { borderColor: whiteColor },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        disabled={loading}
      >
        <LinearGradient
          colors={["#26be0b", "#1b8a07", "#47733f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, loading && styles.gradientLoading]}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <Animated.View
                style={{ transform: [{ rotate: spinInterpolate }] }}
              >
                <Ionicons name="sparkles" size={14} color={whiteColor} />
              </Animated.View>
              <Text style={[styles.loadingText, { color: whiteColor }]}>
                sedang memroses
              </Text>
              <View style={styles.dotsRow}>
                <Animated.Text
                  style={[styles.dot, { color: whiteColor }, dotStyle(dot1)]}
                >
                  •
                </Animated.Text>
                <Animated.Text
                  style={[styles.dot, { color: whiteColor }, dotStyle(dot2)]}
                >
                  •
                </Animated.Text>
                <Animated.Text
                  style={[styles.dot, { color: whiteColor }, dotStyle(dot3)]}
                >
                  •
                </Animated.Text>
              </View>
            </View>
          ) : (
            <Ionicons name="sparkles" size={18} color={whiteColor} />
          )}
        </LinearGradient>
      </TouchableOpacity>

      <AiPromptBottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        onSend={handleSend}
        onVoicePress={handleVoicePress}
        value={isListening ? transcript : voicePrompt}
        onValueChange={setVoicePrompt}
        isListening={isListening}
      />

      <AiTransactionConfirmModal
        visible={!!draft || draftItems.length > 0}
        draft={draft}
        items={draftItems}
        saving={saving}
        onCancel={() => { setDraft(null); setDraftItems([]); }}
        onConfirm={draft ? handleConfirmTransaction : handleSaveAllItems}
        onConfirmItem={handleSaveSingleItem}
      />

      <AiDeleteConfirmModal
        visible={!!deleteTarget}
        target={deleteTarget}
        saving={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <AiUpdateConfirmModal
        visible={!!updatePayload}
        payload={updatePayload}
        saving={saving}
        onCancel={() => setUpdatePayload(null)}
        onConfirm={handleConfirmUpdate}
      />

      <Modal
        visible={resultVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setResultVisible(false);
          setResultMessage(null);
        }}
      >
        <View style={styles.resultOverlay}>
          <View
            style={[
              styles.resultCard,
              shadow.heroCard,
              { backgroundColor: cardColor },
            ]}
          >
            <Text style={[styles.resultText, { color: textColor }]}>
              {resultMessage}
            </Text>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: primaryColor }]}
              onPress={() => {
                setResultVisible(false);
                setResultMessage(null);
              }}
              activeOpacity={0.85}
            >
              <Text style={[styles.resultButtonText, { color: bgColor }]}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 2,
    shadowColor: "#051125",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: radius.full - 2,
    alignItems: "center",
    justifyContent: "center",
  },
  fabLoading: { width: 160, height: 48 },
  gradientLoading: { paddingHorizontal: 12 },
  resultOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,17,37,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.marginMobile,
  },
  resultCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: radius.xl,
    padding: 20,
    gap: 16,
  },
  resultText: { ...typography.bodyLg },
  resultButton: {
    height: 46,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  resultButtonText: { fontSize: 12, fontWeight: "600" },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 6,
  },
  loadingText: { fontSize: 10, fontWeight: "600" },
  dotsRow: { flexDirection: "row", marginLeft: 1 },
  dot: { fontSize: 14, lineHeight: 14, marginHorizontal: 0.5 },
});

export default AiButton;
