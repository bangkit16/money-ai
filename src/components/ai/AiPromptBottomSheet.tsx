// migrated to useColor
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { radius, spacing, typography, shadow } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { Text } from "@/components/ui/text";

type AiPromptBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  onSend: (prompt: string) => void;
  onVoicePress?: () => void;
};

export default function AiPromptBottomSheet({
  visible,
  onClose,
  onSend,
  onVoicePress,
}: AiPromptBottomSheetProps) {
  const cardColor = useColor("card");
  const handleColor = useColor("border");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const mutedBgColor = useColor("muted");
  const primaryColor = useColor("primary");
  const whiteColor = useColor("background");

  const [prompt, setPrompt] = useState("");
  const [mounted, setMounted] = useState(visible);
  const [prevVisible, setPrevVisible] = useState(visible);
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const sheetTranslateY = useMemo(() => new Animated.Value(300), []);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setMounted(true);
    }
  }

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
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
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 400,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const canSend = prompt.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(prompt.trim());
    setPrompt("");
  };

  const handleClose = () => {
    setPrompt("");
    onClose();
  };

  return (
    <Modal
      visible={visible || mounted}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            shadow.heroCard,
            { backgroundColor: cardColor, transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={[styles.handleBar, { backgroundColor: handleColor }]} />

          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.aiIconChip}>
                <Ionicons name="sparkles" size={14} color={whiteColor} />
              </View>
              <Text style={[styles.title, { color: textColor }]}>Ask Dompety AI</Text>
            </View>
            <TouchableOpacity hitSlop={10} onPress={handleClose}>
              <Ionicons
                name="close"
                size={22}
                color={textMutedColor}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Tanyakan sesuatu tentang keuanganmu..."
            placeholderTextColor={textMutedColor}
            multiline
            autoFocus
            style={[styles.input, { color: textColor, backgroundColor: mutedBgColor }]}
          />

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.voiceButton, { borderColor, backgroundColor: cardColor }]}
              activeOpacity={0.85}
              onPress={onVoicePress}
            >
              <Ionicons name="mic-outline" size={20} color={primaryColor} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButtonContainer}
              activeOpacity={0.85}
              onPress={handleSend}
              disabled={!canSend}
            >
              <LinearGradient
                colors={
                  canSend
                    ? ["#26be0b", "#1b8a07", "#47733f"]
                    : [handleColor, handleColor]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="arrow-up" size={20} color={whiteColor} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    gap: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  aiIconChip: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: "#1b8a07",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.titleMd, fontSize: 16 },

  input: {
    ...typography.bodyLg,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 96,
    textAlignVertical: "top",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  voiceButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    shadowColor: "#051125",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sendButtonGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});