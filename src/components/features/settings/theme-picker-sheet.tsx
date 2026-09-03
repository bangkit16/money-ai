// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useModeContext, type Mode } from "@/providers/mode-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ANIMATION_DURATION = 250;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const OPTIONS: { value: Mode; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { value: "light", label: "Light", icon: "light-mode" },
  { value: "dark", label: "Dark", icon: "dark-mode" },
  { value: "system", label: "System", icon: "settings-brightness" },
];

export function ThemePickerSheet({ visible, onClose }: Props) {
  const modeCtx = useModeContext();
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");

  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const sheetTranslateY = useMemo(() => new Animated.Value(300), []);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) setMounted(true);
  }

  useEffect(() => {
    if (visible) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible || mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalBackdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onClose}
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
          <View style={[styles.modalHandle, { backgroundColor: handleColor }]} />
          <Text style={[styles.modalTitle, { color: textColor }]}>Theme</Text>

          {OPTIONS.map((opt) => {
            const active = modeCtx?.mode === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.85}
                style={[styles.optionRow, { borderTopColor: borderColor }]}
                onPress={() => {
                  modeCtx?.setMode(opt.value);
                  onClose();
                }}
              >
                <MaterialIcons
                  name={opt.icon}
                  size={20}
                  color={active ? primaryColor : textColor}
                />
                <Text style={[styles.optionRowText, { color: textColor }]}>
                  {opt.label}
                </Text>
                {active ? (
                  <MaterialIcons name="check" size={20} color={primaryColor} />
                ) : null}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.optionCancelRow} onPress={onClose}>
            <Text style={[styles.optionCancelText, { color: textMutedColor }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
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
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitle: {
    ...typography.titleMd,
    textAlign: "center",
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  optionRowText: { ...typography.bodyLg, flex: 1 },
  optionCancelRow: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  optionCancelText: {
    ...typography.titleMd,
    fontSize: 15,
  },
});