import { View, Text, StyleSheet, Platform } from "react-native";
import { colors, typography, spacing } from "../../constants/theme";

// Placeholder — belum ada desain untuk halaman ini di referensi asal.
export default function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>Settings</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>
          Halaman Settings belum didesain — placeholder sementara.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
  },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.marginMobile,
  },
  text: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
});
