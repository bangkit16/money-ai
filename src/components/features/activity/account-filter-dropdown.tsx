// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ANIMATION_DURATION = 250;

type AccountFilterOption = {
  id: number;
  account_name: string;
};

type AccountFilterDropdownProps = {
  accounts: AccountFilterOption[];
  selectedAccountId: number | null;
  onChange: (id: number | null) => void;
};

export function AccountFilterDropdown({
  accounts,
  selectedAccountId,
  onChange,
}: AccountFilterDropdownProps) {
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const onPrimaryColor = useColor("onPrimary");
  const t = useT();

  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const sheetTranslateY = useMemo(() => new Animated.Value(300), []);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslateY, {
          toValue: 0,
          speed: 30,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 400,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible, mounted, backdropOpacity, sheetTranslateY]);

  if (!accounts || accounts.length === 0) return null;

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);
  const isFiltered = selectedAccountId !== null;
  const label = selectedAccount
    ? selectedAccount.account_name
    : t("activity.filterAllAccounts");

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={[
          styles.trigger,
          {
            backgroundColor: isFiltered ? primaryColor : cardColor,
            borderColor: isFiltered ? primaryColor : borderColor,
          },
        ]}
      >
        <View style={styles.triggerLeft}>
          <MaterialIcons
            name={isFiltered ? "account-balance" : "account-balance-wallet"}
            size={13}
            color={isFiltered ? onPrimaryColor : textMutedColor}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.triggerText,
              { color: isFiltered ? onPrimaryColor : textMutedColor },
            ]}
          >
            {label}
          </Text>
        </View>

        <View style={styles.triggerRight}>
          {isFiltered && (
            <TouchableOpacity
              hitSlop={{ top: 8, bottom: 8, left: 6, right: 4 }}
              onPress={(e) => {
                e.stopPropagation?.();
                onChange(null);
              }}
              style={styles.clearBtn}
            >
              <MaterialIcons name="close" size={13} color={onPrimaryColor} />
            </TouchableOpacity>
          )}
          <MaterialIcons
            name="keyboard-arrow-down"
            size={15}
            color={isFiltered ? onPrimaryColor : textMutedColor}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible || mounted}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.modalBackdrop, { opacity: backdropOpacity }]}
          >
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => setVisible(false)}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.modalSheet,
              shadow.heroCard,
              {
                backgroundColor: cardColor,
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
          >
            <View
              style={[styles.modalHandle, { backgroundColor: handleColor }]}
            />
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {t("activity.filterAccountTitle")}
            </Text>

            <ScrollView style={styles.optionsList} bounces={false}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.optionRow, { borderTopColor: borderColor }]}
                onPress={() => {
                  onChange(null);
                  setVisible(false);
                }}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={20}
                  color={!isFiltered ? primaryColor : textMutedColor}
                />
                <Text
                  style={[
                    styles.optionText,
                    { color: !isFiltered ? primaryColor : textColor },
                    !isFiltered && styles.optionTextActive,
                  ]}
                >
                  {t("activity.filterAllAccounts")}
                </Text>
                {!isFiltered && (
                  <MaterialIcons name="check" size={20} color={primaryColor} />
                )}
              </TouchableOpacity>

              {accounts.map((acc) => {
                const active = selectedAccountId === acc.id;
                return (
                  <TouchableOpacity
                    key={acc.id}
                    activeOpacity={0.85}
                    style={[styles.optionRow, { borderTopColor: borderColor }]}
                    onPress={() => {
                      onChange(acc.id);
                      setVisible(false);
                    }}
                  >
                    <MaterialIcons
                      name="account-balance"
                      size={20}
                      color={active ? primaryColor : textMutedColor}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        { color: active ? primaryColor : textColor },
                        active && styles.optionTextActive,
                      ]}
                    >
                      {acc.account_name}
                    </Text>
                    {active && (
                      <MaterialIcons
                        name="check"
                        size={20}
                        color={primaryColor}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.optionCancelRow}
              onPress={() => setVisible(false)}
            >
              <Text
                style={[styles.optionCancelText, { color: textMutedColor }]}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
    maxWidth: 180,
    flexShrink: 0,
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  triggerText: {
    ...typography.labelCaps,
    flexShrink: 1,
  },
  triggerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  clearBtn: {
    padding: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  modalSheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    alignSelf: "center",
    marginBottom: 8,
  },
  modalTitle: {
    ...typography.titleMd,
    textAlign: "center",
    marginBottom: 8,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  optionText: {
    ...typography.bodyLg,
    flex: 1,
  },
  optionTextActive: {
    fontWeight: "700",
  },
  optionCancelRow: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  optionCancelText: {
    ...typography.titleMd,
    fontSize: 13,
  },
});
