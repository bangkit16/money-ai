import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthGuard } from "@/components/auth-guard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ModeProvider } from "@/providers/mode-provider";
import { SettingsProvider } from "@/providers/settings-provider";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModeProvider storage={AsyncStorage} storageKey="app.theme">
        <SettingsProvider>
        <AuthGuard>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="add-transaction"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </AuthGuard>
        </SettingsProvider>
      </ModeProvider>
    </QueryClientProvider>
  );
}
