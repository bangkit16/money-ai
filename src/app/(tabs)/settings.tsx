import { LogoutButton } from "@/components/features/settings/logout-button";
import { LogoutConfirmModal } from "@/components/features/settings/logout-confirm-modal";
import { CurrencyPickerSheet } from "@/components/features/settings/currency-picker-sheet";
import { SettingRow } from "@/components/features/settings/setting-row";
import { ThemePickerSheet } from "@/components/features/settings/theme-picker-sheet";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { useModeContext, type Mode } from "@/providers/mode-provider";
import { useSettings, CURRENCIES } from "@/providers/settings-provider";
import { radius, spacing, typography } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase";

const MODE_LABEL: Record<Mode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

export default function SettingsScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [currencyVisible, setCurrencyVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const modeCtx = useModeContext();
  const { currency } = useSettings();
  const bg = useColor("background");
  const primary = useColor("primary");
  const errorColor = useColor("error");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      setConfirmVisible(false);
    }
  };

  const currencyMeta = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.wordmark, { color: primary }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Preferences">
          <SettingRow
            icon="dark-mode"
            iconColor={primary}
            title="Theme"
            description="Light, dark, or follow system"
            value={modeCtx ? MODE_LABEL[modeCtx.mode] : "System"}
            onPress={() => setThemeVisible(true)}
          />
          <SettingRow
            icon="attach-money"
            iconColor={primary}
            title="Currency"
            description="Display format for amounts"
            value={`${currencyMeta.symbol}  ${currencyMeta.code}`}
            onPress={() => setCurrencyVisible(true)}
          />
        </Section>

        <Section title="Account">
          <LogoutButton onPress={() => setConfirmVisible(true)} />
        </Section>
      </ScrollView>

      <LogoutConfirmModal
        visible={confirmVisible}
        isLoggingOut={isLoggingOut}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleLogout}
      />
      <ThemePickerSheet
        visible={themeVisible}
        onClose={() => setThemeVisible(false)}
      />
      <CurrencyPickerSheet
        visible={currencyVisible}
        onClose={() => setCurrencyVisible(false)}
      />
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
  },
  wordmark: { ...typography.headlineLgMobile },

  body: { padding: spacing.marginMobile, gap: spacing.gutter, paddingBottom: 48 },
  section: { gap: 8 },
  sectionTitle: {
    ...typography.labelCaps,
    color: "#75777d",
  },
  sectionBody: { gap: 8, borderRadius: radius.lg },
});
