import React, { useState } from "react";
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
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { PRO_PRICING, ProService, type SubscriptionPlan } from "@/services/proService";
import { useToast } from "@/components/ui/toast";

type UpgradeModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function UpgradeModal({ visible, onClose }: UpgradeModalProps) {
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
        toast.success("Selamat! Anda telah menjadi anggota Pro.");
        onClose();
      } else {
        toast.error("Gagal memproses langganan.");
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "sparkles",
      title: "60 Permintaan AI / Hari",
      desc: "Jatah 12x lebih banyak untuk catat transaksi via suara & teks.",
    },
    {
      icon: "wallet",
      title: "Akun & Dompet Tanpa Batas",
      desc: "Bebas buat rekening bank, e-wallet, kas tanpa limit 4 akun.",
    },
    {
      icon: "shield-checkmark",
      title: "100% Bebas Iklan",
      desc: "Aplikasi bersih tanpa gangguan banner maupun rewarded ads.",
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
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={["#EAB308", "#CA8A04"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.proBadge}
              >
                <Ionicons name="star" size={14} color="#FFFFFF" />
                <Text style={styles.proBadgeText}>MONEY AI PRO</Text>
              </LinearGradient>
            </View>

            <Text style={[styles.title, { color: textColor }]}>
              Buka Semua Potensi Keuangan
            </Text>
            <Text style={[styles.subtitle, { color: textMuted }]}>
              Kelola uang lebih cepat, cerdas, dan tanpa hambatan kuota.
            </Text>

            <View style={styles.featureList}>
              {features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={[styles.iconBox, { backgroundColor: primaryColor + "15" }]}>
                    <Ionicons name={f.icon as any} size={20} color={primaryColor} />
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
                  selectedPlan === "yearly" && { backgroundColor: primaryColor + "08" },
                ]}
              >
                <View style={styles.planHeader}>
                  <View style={styles.radioRow}>
                    <Ionicons
                      name={selectedPlan === "yearly" ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={selectedPlan === "yearly" ? primaryColor : textMuted}
                    />
                    <Text style={[styles.planName, { color: textColor }]}>
                      {PRO_PRICING.yearly.name}
                    </Text>
                  </View>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountText}>{PRO_PRICING.yearly.discountBadge}</Text>
                  </View>
                </View>
                <Text style={[styles.planPrice, { color: textColor }]}>
                  {PRO_PRICING.yearly.priceText}
                  <Text style={[styles.planPeriod, { color: textMuted }]}>
                    {" " + PRO_PRICING.yearly.periodText}
                  </Text>
                </Text>
              </TouchableOpacity>

              {/* Monthly */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedPlan("monthly")}
                style={[
                  styles.planOption,
                  { borderColor: selectedPlan === "monthly" ? primaryColor : borderColor },
                  selectedPlan === "monthly" && { backgroundColor: primaryColor + "08" },
                ]}
              >
                <View style={styles.planHeader}>
                  <View style={styles.radioRow}>
                    <Ionicons
                      name={selectedPlan === "monthly" ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={selectedPlan === "monthly" ? primaryColor : textMuted}
                    />
                    <Text style={[styles.planName, { color: textColor }]}>
                      {PRO_PRICING.monthly.name}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.planPrice, { color: textColor }]}>
                  {PRO_PRICING.monthly.priceText}
                  <Text style={[styles.planPeriod, { color: textMuted }]}>
                    {" " + PRO_PRICING.monthly.periodText}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.subscribeBtn, { backgroundColor: primaryColor }]}
              onPress={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.subscribeText}>
                  Langganan Sekarang (
                  {selectedPlan === "yearly"
                    ? PRO_PRICING.yearly.priceText
                    : PRO_PRICING.monthly.priceText}
                  )
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: "90%",
    borderRadius: radius.xxl,
    padding: 20,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
    padding: 4,
  },
  content: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
  },
  badgeContainer: {
    marginBottom: 12,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  proBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  title: {
    ...typography.titleLg,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodySm,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureList: {
    width: "100%",
    gap: 14,
    marginBottom: 22,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.titleSm,
    fontSize: 14,
  },
  featureDesc: {
    ...typography.bodySm,
    fontSize: 12,
    marginTop: 1,
  },
  plansContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  planOption: {
    borderWidth: 2,
    borderRadius: radius.xl,
    padding: 14,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  planName: {
    ...typography.titleMd,
    fontSize: 15,
  },
  discountTag: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  planPrice: {
    ...typography.titleLg,
    fontSize: 18,
    paddingLeft: 28,
  },
  planPeriod: {
    ...typography.bodySm,
    fontSize: 13,
  },
  subscribeBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeText: {
    color: "#FFFFFF",
    ...typography.titleMd,
    fontSize: 15,
  },
});
