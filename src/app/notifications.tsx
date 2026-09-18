import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationList } from "@/components/features/shared/notification-list";
import { useColor } from "@/hooks/useColor";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import { spacing, typography } from "@/constants/theme";
import { useEffect, useMemo } from "react";

export default function NotificationsScreen() {
  const bgColor = useColor("background");
  const textColor = useColor("text");
  const router = useRouter();

  const entrance = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: bgColor, opacity: entrance },
        ]}
      >
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
          hitSlop={10}
        >
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Notifikasi</Text>
        <View style={styles.headerBtn} />
      </Animated.View>
      <Animated.View
        style={{
          flex: 1,
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <NotificationList />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: 10,
    marginTop: spacing.marginMobile,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.titleMd },
});