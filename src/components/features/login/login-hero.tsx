// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, View } from "react-native";
import ICON from "@/assets/images/adaptive-icon.png";

export function LoginHero() {
  const whiteColor = useColor("white");
  return (
    <LinearGradient
      colors={["#102010", "#0a430a", "#034903"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.logoCircle}>
        <Image source={ICON} style={styles.logoImage} resizeMode="contain" />
      </View>
      <Text style={[styles.wordmark, { color: whiteColor }]}>Dompety</Text>
      <Text style={styles.tagline}>Quiet confidence for your money</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.marginMobile,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  logoImage: {
    width: 56,
    height: 56,
  },
  wordmark: { ...typography.headlineLg, fontSize: 30 },
  tagline: {
    ...typography.bodyLg,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
});