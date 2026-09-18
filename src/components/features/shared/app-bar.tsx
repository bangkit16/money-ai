// migrated to useColor
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
  const router = useRouter();

  const handleNotificationsPress = () => {
    router.push("/notifications");
  };

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
        <TouchableOpacity hitSlop={10} onPress={handleNotificationsPress} style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={primaryColor} />
          <View style={[styles.badge, { backgroundColor: primaryColor }]}>
            <Text style={styles.badgeText}>3</Text>
          </View>
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
  notificationButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
