import { useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PRO_PRICING, ProService, type SubscriptionPlan } from "@/services/proService";
import { useToast } from "@/components/ui/toast";
import { useT } from "@/i18n";

type UpgradeModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
  const t = useT();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("yearly");
  const [loading, setLoading] = useState(false);

  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMuted = useColor("textMuted");
  const primaryColor = useColor("primary");
  const borderColor = useColor("border");
  const toast = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const duration = selectedPlan === "yearly" ? 12 : 1;
      const ok = await ProService.activatePro(duration);
      if (ok) {
        toast.success(t("pro.subscribeSuccess"));
        onClose();
      } else {
        toast.error(t("pro.subscribeError"));
      }
    } catch (e: any) {
      toast.error(e?.message ?? t("common.genericError"));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "sparkles",
      title: t("pro.feature1Title"),
      desc: t("pro.feature1Desc"),
    },
    {
      icon: "wallet-outline",
      title: t("pro.feature2Title"),
      desc: t("pro.feature2Desc"),
    },
    {
      icon: "shield-checkmark-outline",
      title: t("pro.feature3Title"),
      desc: t("pro.feature3Desc"),
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: cardColor }, shadow.heroCard]}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={20} color={textMuted} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Header Icon */}
            <LinearGradient
              colors={["#FEF08A", "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroIconBadge}
            >
              <Ionicons name="star" size={20} color="#78350F" />
            </LinearGradient>

            <View style={styles.badgeContainer}>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>{t("pro.modalBadge")}</Text>
              </View>
            </View>

            <Text style={[styles.title, { color: textColor }]}>
              {t("pro.title")}
            </Text>
            <Text style={[styles.subtitle, { color: textMuted }]}>
              {t("pro.subtitle")}
            </Text>

            {/* Feature list */}
            <View style={styles.featureList}>
              {features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={[styles.iconBox, { backgroundColor: primaryColor + "14" }]}>
                    <Ionicons name={f.icon as any} size={16} color={primaryColor} />
                  </View>
                  <View style={styles.featureText}>
                    <Text style={[styles.featureTitle, { color: textColor }]}>{f.title}</Text>
                    <Text style={[styles.featureDesc, { color: textMuted }]}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Plan selection */}
            <View style={styles.plansContainer}>
              {/* Yearly */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPlan("yearly")}
                style={[
                  styles.planOption,
                  { borderColor: selectedPlan === "yearly" ? primaryColor : borderColor },
                  selectedPlan === "yearly" && { backgroundColor: primaryColor + "0a" },
                ]}
              >
                <View style={styles.planLeft}>
                  <Ionicons
                    name={selectedPlan === "yearly" ? "radio-button-on" : "radio-button-off"}
                    size={18}
                    color={selectedPlan === "yearly" ? primaryColor : textMuted}
                  />
                  <View style={styles.planInfo}>
                    <View style={styles.planTitleRow}>
                      <Text style={[styles.planName, { color: textColor }]}>
                        {t("pro.planYearly")}
                      </Text>
                      <View style={styles.discountTag}>
                        <Text style={styles.discountText}>{t("pro.discountYearly")}</Text>
                      </View>
                    </View>
                    <Text style={[styles.planSubtext, { color: textMuted }]}>
                      {t("pro.planYearlySubtext")}
                    </Text>
                  </View>
                </View>

                <View style={styles.planRight}>
                  <Text style={[styles.planPrice, { color: textColor }]}>
                    {PRO_PRICING.yearly.priceText}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Monthly */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPlan("monthly")}
                style={[
                  styles.planOption,
                  { borderColor: selectedPlan === "monthly" ? primaryColor : borderColor },
                  selectedPlan === "monthly" && { backgroundColor: primaryColor + "0a" },
                ]}
              >
                <View style={styles.planLeft}>
                  <Ionicons
                    name={selectedPlan === "monthly" ? "radio-button-on" : "radio-button-off"}
                    size={18}
                    color={selectedPlan === "monthly" ? primaryColor : textMuted}
                  />
                  <View style={styles.planInfo}>
                    <Text style={[styles.planName, { color: textColor }]}>
                      {t("pro.planMonthly")}
                    </Text>
                    <Text style={[styles.planSubtext, { color: textMuted }]}>
                      {t("pro.planMonthlySubtext")}
                    </Text>
                  </View>
                </View>

                <View style={styles.planRight}>
                  <Text style={[styles.planPrice, { color: textColor }]}>
                    {PRO_PRICING.monthly.priceText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.subscribeBtn, { backgroundColor: primaryColor }]}
              onPress={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.subscribeText}>
                  {t("pro.subscribeCta", {
                    price:
                      selectedPlan === "yearly"
                        ? PRO_PRICING.yearly.priceText
                        : PRO_PRICING.monthly.priceText,
                  })}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={[styles.guaranteeText, { color: textMuted }]}>
              {t("pro.guarantee")}
            </Text>
          </ScrollView>
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
    maxWidth: 380,
    maxHeight: "90%",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  heroIconBadge: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeContainer: {
    marginBottom: 6,
  },
  proBadge: {
    backgroundColor: "rgba(234,179,8,0.14)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(234,179,8,0.35)",
  },
  proBadgeText: {
    color: "#B45309",
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 12,
    lineHeight: 15,
  },
  featureList: {
    width: "100%",
    gap: 10,
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: 12,
    borderRadius: 12,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  featureDesc: {
    fontSize: 10.5,
    marginTop: 1,
    lineHeight: 14,
  },
  plansContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 16,
  },
  planOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  planInfo: {
    flex: 1,
    gap: 2,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  planName: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  discountTag: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radius.full,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  planSubtext: {
    fontSize: 10,
  },
  planRight: {
    alignItems: "flex-end",
    paddingLeft: 6,
  },
  planPrice: {
    fontSize: 13,
    fontWeight: "700",
  },
  subscribeBtn: {
    width: "100%",
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "600",
  },
  guaranteeText: {
    fontSize: 9.5,
    textAlign: "center",
    marginTop: 8,
  },
});
