// migrated to useColor
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const ICON = require("@/../assets/images/adaptive-icon.png");

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
  const bgColor = useColor("background");
  const primaryColor = useColor("primary");
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: transparent ? "transparent" : bgColor,
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <View style={styles.brand}>
        <Image source={ICON} style={styles.brandIcon} resizeMode="contain" />
        <Text style={[styles.wordmark, { color: primaryColor }]}>{title}</Text>
      </View>
      {showNotifications ? (
        <TouchableOpacity hitSlop={10}>
          <MaterialIcons name="notifications" size={24} color={primaryColor} />
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
    paddingBottom: 10,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
  },
  wordmark: { ...typography.headlineLgMobile },
});
