// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import {
  askAi,
  formatQueryResult,
  type AiPromptResult,
  type AiTransactionDraft,
} from "@/lib/ai";
import { invalidateTransactionCaches } from "@/lib/query-invalidation";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/providers/settings-provider";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
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
import { useToast } from "./ui/toast";
// import AiTransactionConfirmModal from "../ai/AiTransactionConfirmModal";

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
  const bgColor = useColor("background");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<AiTransactionDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [resultVisible, setResultVisible] = useState(false);
  const queryClient = useQueryClient();
  const t = useT();
  const toast = useToast();
  const { autoSaveTransaction } = useSettings();

  console.log("apa nih" + autoSaveTransaction)

  const saveTransaction = async (d: AiTransactionDraft) => {
    const sourceAccountId = d.account_id ?? accountId;
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase.from("transaction").insert({
        transaction: d.description,
        amount: d.amount,
        transaction_type: d.transaction_type,
        category_id: d.category?.id ?? null,
        account_id: sourceAccountId,
        to_account_id: d.to_account_id ?? null,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
      });

      if (error) throw error;

      invalidateTransactionCaches(queryClient);
      const isTransfer = d.transaction_type === "TRANSFER";
      toast.success(
        t("add.saved"),
        isTransfer ? t("add.transferSaved") : t("add.transactionSaved"),
      );
    } catch (e) {
      setResultMessage("Gagal menyimpan transaksi. Coba lagi.");
      setResultVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (prompt: string) => {
    setOpen(false);
    setLoading(true);
    try {
      const result: AiPromptResult = await askAi(prompt);

      if (result.action === "confirm_transaction") {
        if (autoSaveTransaction) {
          await saveTransaction(result.data);
        } else {
          setDraft(result.data);
        }
      } else if (result.action === "show_result") {
        setResultMessage(formatQueryResult(result.tool, result.data));
      } else if (result.action === "text_answer") {
        setResultMessage(result.message);
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

  const handleVoicePress = () => {
    // TODO: hubungkan ke fitur voice-to-text kamu.
    // Setelah dapat hasil teksnya, panggil handleSend(hasilTeks).
  };

  const handleConfirmTransaction = async () => {
    if (!draft) return;
    await saveTransaction(draft);
    setDraft(null);
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
      />

      <AiTransactionConfirmModal
        visible={!!draft}
        draft={draft}
        saving={saving}
        onCancel={() => setDraft(null)}
        onConfirm={handleConfirmTransaction}
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
  resultButtonText: { fontSize: 14, fontWeight: "600" },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 6,
  },
  loadingText: { fontSize: 12, fontWeight: "600" },
  dotsRow: { flexDirection: "row", marginLeft: 1 },
  dot: { fontSize: 16, lineHeight: 16, marginHorizontal: 0.5 },
});

export default AiButton;
