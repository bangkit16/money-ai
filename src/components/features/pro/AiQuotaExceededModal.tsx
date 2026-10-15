import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useT } from "@/i18n";

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
  const t = useT();
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
              ? t("aiQuota.proLimitTitle", { max: maxQuota })
              : t("aiQuota.freeLimitTitle", { max: maxQuota })}
          </Text>

          <Text style={[styles.description, { color: textMuted }]}>
            {isPro
              ? t("aiQuota.proLimitDesc")
              : t("aiQuota.freeLimitDesc")}
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
                  <Text style={styles.primaryButtonText}>{t("aiQuota.watchAd")}</Text>
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
                    {t("aiQuota.upgradePro", { price: "Rp14.900" })}
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
                {isPro ? t("aiQuota.understand") : t("aiQuota.later")}
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
    backgroundColor: "rgba(5,17,37,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.marginMobile,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 15.5,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  actionsContainer: {
    width: "100%",
    gap: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 42,
    borderRadius: 10,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 2,
  },
  cancelText: {
    fontSize: 11,
  },
});
