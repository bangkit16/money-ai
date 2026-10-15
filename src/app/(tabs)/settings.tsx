import { LogoutButton } from "@/components/features/settings/logout-button";
import { ProfileCard } from "@/components/features/settings/profile-card";
import { CurrencyPickerSheet } from "@/components/features/settings/currency-picker-sheet";
import { LanguagePickerSheet } from "@/components/features/settings/language-picker-sheet";
import { SettingRow } from "@/components/features/settings/setting-row";
import { SettingToggle } from "@/components/features/settings/setting-toggle";
import { ThemePickerSheet } from "@/components/features/settings/theme-picker-sheet";
import { ConfirmDialog } from "@/components/features/shared/confirm-dialog";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { useModeContext } from "@/providers/mode-provider";
import { CURRENCIES, LANGUAGES, useSettings } from "@/providers/settings-provider";
import { radius, spacing, typography } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { transactions$ } from "@/store/transactions$";
import { accounts$ } from "@/store/accounts$";
import { user$ } from "@/store/auth$";
import { isPro$ } from "@/store/profile$";
import { useSelector } from "@legendapp/state/react";
import { UpgradeModal } from "@/components/features/pro/UpgradeModal";
import { invalidateTransactionCaches } from "@/lib/query-invalidation";
import { useToast } from "@/components/ui/toast";
import { AppBar } from "@/components/features/shared/app-bar";
import { useT } from "@/i18n";

export default function SettingsScreen() {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteDataVisible, setDeleteDataVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [currencyVisible, setCurrencyVisible] = useState(false);
  const [languageVisible, setLanguageVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const isPro = useSelector(isPro$);
  const modeCtx = useModeContext();
  const { currency, language, usePrimaryAccount, setUsePrimaryAccount, autoSaveTransaction, setAutoSaveTransaction } = useSettings();
  const t = useT();
  const queryClient = useQueryClient();
  const toast = useToast();
  const bg = useColor("background");
  const primary = useColor("primary");
  const destructive = useColor("destructive");

  const handleDeleteAllData = async () => {
    setIsDeletingData(true);
    try {
      const user = user$.peek() ?? (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User belum login");

      const { error: txError } = await supabase
        .from("transaction")
        .delete()
        .eq("user_id", user.id);
      if (txError) throw txError;

      const { error: accError } = await supabase
        .from("account")
        .delete()
        .eq("user_id", user.id);
      if (accError) throw accError;

      transactions$.set({});
      accounts$.set({});

      await AsyncStorage.multiRemove(["transactions_cache", "accounts_cache"]).catch(() => {});

      invalidateTransactionCaches(queryClient);
      queryClient.clear();

      toast.success(t("settings.deleteAllDataSuccess"));
    } catch (error) {
      console.error("Delete all data error:", error);
      toast.error(t("settings.deleteAllDataError"));
    } finally {
      setIsDeletingData(false);
      setDeleteDataVisible(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      transactions$.set({});
      accounts$.set({});
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
        <ProfileCard />

        {!isPro && (
          <TouchableOpacity
            style={[styles.proBanner, { backgroundColor: primary }]}
            onPress={() => setUpgradeVisible(true)}
            activeOpacity={0.85}
          >
            <View style={styles.proBannerText}>
              <Text style={styles.proBannerTitle}>{t("settings.upgradeTitle")}</Text>
              <Text style={styles.proBannerSubtitle}>
                {t("settings.upgradeSubtitle")}
              </Text>
            </View>
            <View style={styles.proBannerButton}>
              <Text style={styles.proBannerButtonText}>{t("settings.upgradeButton")}</Text>
            </View>
          </TouchableOpacity>
        )}

        <Section title={t("settings.preferences")}>
          <SettingRow
            icon="dark-mode"
            iconColor={primary}
            title={t("settings.theme")}
            description={t("settings.themeDesc")}
            value={modeCtx ? t(`theme.${modeCtx.mode}`) : t("theme.system")}
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

        <Section title={t("settings.aiSettings")}>
          <SettingToggle
            icon="account-balance"
            iconColor={primary}
            title={t("settings.usePrimaryAccount")}
            description={t("settings.usePrimaryAccountDesc")}
            value={usePrimaryAccount}
            onValueChange={setUsePrimaryAccount}
          />
          <SettingToggle
            icon="save"
            iconColor={primary}
            title={t("settings.autoSaveTransaction")}
            description={t("settings.autoSaveTransactionDesc")}
            value={autoSaveTransaction}
            onValueChange={setAutoSaveTransaction}
          />
        </Section>

        <Section title={t("settings.dataManagement")}>
          <SettingRow
            icon="delete-outline"
            iconColor={destructive}
            title={t("settings.deleteAllData")}
            description={t("settings.deleteAllDataDesc")}
            onPress={() => setDeleteDataVisible(true)}
          />
        </Section>

        <Section title={t("settings.account")}>
          <LogoutButton onPress={() => setConfirmVisible(true)} />
        </Section>
      </ScrollView>

      <ConfirmDialog
        visible={deleteDataVisible}
        title={t("settings.deleteAllDataConfirmTitle")}
        message={t("settings.deleteAllDataConfirmMessage")}
        confirmLabel={t("settings.deleteAllDataConfirmButton")}
        isConfirming={isDeletingData}
        onClose={() => setDeleteDataVisible(false)}
        onConfirm={handleDeleteAllData}
      />

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
      <UpgradeModal
        visible={upgradeVisible}
        onClose={() => setUpgradeVisible(false)}
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
    paddingTop: Platform.OS === "ios" ? 48 : 20,
    paddingBottom: 10,
  },
  wordmark: { ...typography.headlineLgMobile },

  body: { padding: spacing.marginMobile, gap: spacing.gutter, paddingBottom: 40 },
  proBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: radius.xl,
    gap: 12,
  },
  proBannerText: {
    flex: 1,
    gap: 4,
  },
  proBannerTitle: {
    ...typography.titleMd,
    fontSize: 15,
    color: "#FFFFFF",
  },
  proBannerSubtitle: {
    ...typography.bodySm,
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  proBannerButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  proBannerButtonText: {
    ...typography.bodySm,
    fontWeight: "700",
    color: "#0a2505",
  },
  section: { gap: 6 },
  sectionTitle: {
    ...typography.labelCaps,
    color: "#75777d",
  },
  sectionBody: { gap: 8, borderRadius: radius.lg },
});
