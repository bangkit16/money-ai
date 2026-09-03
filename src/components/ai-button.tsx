// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import {
  askAi,
  formatQueryResult,
  type AiPromptResult,
  type AiTransactionDraft,
} from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import AiPromptBottomSheet from "./ai/AiPromptBottomSheet";
import AiTransactionConfirmModal from "./ai/AiTransactionConfirmModal";
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
  const [fallbackAccountId, setFallbackAccountId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (accountId) return;

    const loadFirstAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("account")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (data) setFallbackAccountId(data.id);
    };

    loadFirstAccount();
  }, [accountId]);

  const handleSend = async (prompt: string) => {
    setOpen(false);
    setLoading(true);
    try {
      const result: AiPromptResult = await askAi(prompt);

      if (result.action === "confirm_transaction") {
        setDraft(result.data);
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

  const handleVoicePress = () => {
    // TODO: hubungkan ke fitur voice-to-text kamu.
    // Setelah dapat hasil teksnya, panggil handleSend(hasilTeks).
  };

  const handleConfirmTransaction = async () => {
    if (!draft) return;

    const sourceAccountId = accountId ?? fallbackAccountId;
    if (!sourceAccountId) {
      setDraft(null);
      setResultMessage("Akun sumber tidak ditemukan. Buat akun terlebih dulu.");
      return;
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase.from("transaction").insert({
        transaction: draft.description,
        amount: draft.amount,
        transaction_type: draft.transaction_type,
        category_id: draft.category?.id ?? null,
        account_id: sourceAccountId,
        to_account_id: draft.to_account_id ?? null,
        user_id: user.id,
        transaction_date: new Date().toISOString(),
      });

      if (error) throw error;

      setDraft(null);
      setResultMessage("Transaksi tersimpan.");
    } catch (e) {
      setResultMessage("Gagal menyimpan transaksi. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fabContainer, { borderColor: whiteColor }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        disabled={loading}
      >
        <LinearGradient
          colors={["#26be0b", "#1b8a07", "#47733f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons
            name={loading ? "hourglass-outline" : "sparkles"}
            size={18}
            color={whiteColor}
          />
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
        visible={!!resultMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setResultMessage(null)}
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
              onPress={() => setResultMessage(null)}
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
});

export default AiButton;
