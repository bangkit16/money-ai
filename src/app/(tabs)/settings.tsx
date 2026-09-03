import { LogoutButton } from "@/components/features/settings/logout-button";
import { CurrencyPickerSheet } from "@/components/features/settings/currency-picker-sheet";
import { LanguagePickerSheet } from "@/components/features/settings/language-picker-sheet";
import { SettingRow } from "@/components/features/settings/setting-row";
import { ThemePickerSheet } from "@/components/features/settings/theme-picker-sheet";
import { ConfirmDialog } from "@/components/features/shared/confirm-dialog";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { useModeContext, type Mode } from "@/providers/mode-provider";
import { CURRENCIES, LANGUAGES, useSettings } from "@/providers/settings-provider";
import { radius, spacing, typography } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { AppBar } from "@/components/features/shared/app-bar";
import { useT } from "@/i18n";

const MODE_LABEL: Record<Mode, string> = {
  light: "Terang",
  dark: "Gelap",
  system: "Sistem",
};

export default function SettingsScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [currencyVisible, setCurrencyVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const modeCtx = useModeContext();
  const { currency, language } = useSettings();
  const t = useT();
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
  const languageMeta = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      <AppBar />

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Section title={t("settings.preferences")}>
          <SettingRow
            icon="dark-mode"
            iconColor={primary}
            title={t("settings.theme")}
            description={t("settings.themeDesc")}
            value={modeCtx ? MODE_LABEL[modeCtx.mode] : "Sistem"}
            onPress={() => setThemeVisible(true)}
          />
          <SettingRow
            icon="attach-money"
            iconColor={primary}
            title={t("settings.currency")}
            description={t("settings.currencyDesc")}
            value={`${currencyMeta.symbol}  ${currencyMeta.code}`}
            onPress={() => setCurrencyVisible(true)}
          />
          <SettingRow
            icon="language"
            iconColor={primary}
            title={t("settings.language")}
            description={t("settings.languageDesc")}
            value={languageMeta.label}
            onPress={() => setLanguageVisible(true)}
          />
        </Section>

        <Section title={t("settings.account")}>
          <LogoutButton onPress={() => setConfirmVisible(true)} />
        </Section>
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title={t("settings.logoutConfirmTitle")}
        message={t("settings.logoutConfirmMessage")}
        confirmLabel={t("settings.logoutConfirmButton")}
        isConfirming={isLoggingOut}
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
      <LanguagePickerSheet
        visible={languageVisible}
        onClose={() => setLanguageVisible(false)}
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
