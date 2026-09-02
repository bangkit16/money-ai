// migrated to useColor
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "./ui/text";

function Header() {
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  return (
    <View style={[styles.header, { backgroundColor: bgColor }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.wordmark, { color: primaryColor }]}>Dompety</Text>
      </View>
      <TouchableOpacity hitSlop={10}>
        <MaterialIcons name="notifications" size={24} color={primaryColor} />
      </TouchableOpacity>
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
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  wordmark: { ...typography.headlineLgMobile },
});

export default Header;