// migrated to useColor
import AddTransactionButton from "@/components/add-transaction-button";
import AiButton from "@/components/ai-button";
import { colors, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { useSettings } from "@/providers/settings-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  const primaryColor = useColor("primary");
  const outlineColor = useColor("textMuted");
  const tabBarBg = useColor("background");
  const t = useT();
  const lang = useSettings().language;
  return (
    <View key={lang} style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: primaryColor,
          tabBarInactiveTintColor: outlineColor,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopWidth: 0,
            height: 84,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontFamily: "Poppins-Bold",
            fontSize: typography.labelCaps.fontSize,
            fontWeight: typography.labelCaps.fontWeight,
            textTransform: "uppercase",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.dashboard"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: t("tabs.activity"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt-long" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: t("tabs.analytics"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="insert-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: t("tabs.account"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t("tabs.settings"),
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <View style={styles.fab}>
        <AiButton />
        <AddTransactionButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fab: {
    position: "absolute",
    right: 23,
    bottom: 90,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});