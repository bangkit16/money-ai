import AiButton from "@/components/ai-button";
import AddTransactionButton from "@/components/add-transaction-button";
import { colors, typography } from "@/constants/theme";
import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { MaterialIcons } from "@expo/vector-icons";
import { SplashScreen, Tabs } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Header from "@/components/header";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false, // tiap screen bikin header sendiri di dalam JSX
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.outline,
          tabBarStyle: {
            backgroundColor: colors.surface,
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
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="activity"
          options={{
            title: "Activity",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="receipt-long" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="insert-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
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
