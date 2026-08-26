import { Text } from "@/components/ui/text";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

export function LoginHero() {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}
    >
      <View style={styles.logoCircle}>
        <MaterialCommunityIcons
          name="chart-donut"
          size={32}
          color={colors.white}
        />
      </View>
      <Text style={styles.wordmark}>Dompety</Text>
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
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  wordmark: { ...typography.headlineLg, fontSize: 30, color: colors.white },
  tagline: {
    ...typography.bodyLg,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
});
