import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

type AiQuotaExceededModalProps = {
  visible: boolean;
  isPro: boolean;
  maxQuota: number;
  onClose: () => void;
  onWatchAd: () => void;
  onUpgradePro: () => void;
};

export function AiQuotaExceededModal({
  visible,
  isPro,
  maxQuota,
  onClose,
  onWatchAd,
  onUpgradePro,
}: AiQuotaExceededModalProps) {
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");
  const primaryColor = useColor("primary");
  const borderColor = useColor("border");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: cardColor }, shadow.heroCard]}>
          <View style={[styles.iconCircle, { backgroundColor: primaryColor + "15" }]}>
            <Ionicons
              name={isPro ? "time-outline" : "sparkles"}
              size={32}
              color={primaryColor}
            />
          </View>

          <Text style={[styles.title, { color: textColor }]}>
            {isPro
              ? `Batas AI Pro Tercapai (${maxQuota}/${maxQuota})`
              : `Kuota AI Harian Habis (${maxQuota}/${maxQuota})`}
          </Text>

          <Text style={[styles.description, { color: textMuted }]}>
            {isPro
              ? "Anda telah mencapai batas wajar harian 60 permintaan AI. Kuota harian Anda akan direset otomatis besok."
              : "Dapatkan tambahan +3 kuota gratis dengan menonton iklan video, atau tingkatkan ke Pro untuk kuota 60/hari dan tanpa iklan."}
          </Text>

          <View style={styles.actionsContainer}>
            {!isPro && (
              <>
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: primaryColor }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    onClose();
                    onWatchAd();
                  }}
                >
                  <Ionicons name="play-circle-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Tonton Iklan (+3 Kuota)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryButton, { borderColor }]}
                  activeOpacity={0.85}
                  onPress={() => {
                    onClose();
                    onUpgradePro();
                  }}
                >
                  <Ionicons name="star" size={18} color="#EAB308" />
                  <Text style={[styles.secondaryButtonText, { color: textColor }]}>
                    Upgrade ke Pro (Rp14.900)
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: textMuted }]}>
                {isPro ? "Mengerti" : "Nanti Saja"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.marginMobile,
  },
  card: {
    width: "100%",
    borderRadius: radius.xxl,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    ...typography.titleLg,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    ...typography.bodySm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  actionsContainer: {
    width: "100%",
    gap: 10,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.xl,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    ...typography.titleMd,
    fontSize: 15,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  secondaryButtonText: {
    ...typography.titleSm,
    fontSize: 14,
  },
  cancelButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: {
    ...typography.bodySm,
    fontSize: 13,
  },
});
