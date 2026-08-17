import { colors, spacing, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./ui/text";

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.wordmark}>WealthFlow</Text>
      </View>
      <TouchableOpacity hitSlop={10}>
        <MaterialIcons name="notifications" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },
});

export default Header;
