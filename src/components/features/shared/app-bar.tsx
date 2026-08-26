import { Text } from "@/components/ui/text";
import { colors, spacing, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";

type AppBarProps = {
  title?: string;
  showNotifications?: boolean;
  transparent?: boolean;
};

export function AppBar({
  title = "Dompety",
  showNotifications = true,
  transparent = false,
}: AppBarProps) {
  return (
    <View style={[styles.header, transparent && { backgroundColor: "transparent" }]}>
      <Text style={styles.wordmark}>{title}</Text>
      {showNotifications ? (
        <TouchableOpacity hitSlop={10}>
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
    backgroundColor: colors.surface,
  },
  wordmark: { ...typography.headlineLgMobile, color: colors.primary },
});
