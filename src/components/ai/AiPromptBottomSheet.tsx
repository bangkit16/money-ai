import { useEffect, useRef, useState } from "react";
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
import { colors, radius, spacing, typography, shadow } from "@/constants/theme";
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
  const [prompt, setPrompt] = useState("");
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backdropOpacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
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
      visible={visible}
      transparent
      animationType="slide"
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

        <View style={[styles.sheet, shadow.heroCard]}>
          <View style={styles.handleBar} />

          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.aiIconChip}>
                <Ionicons name="sparkles" size={14} color={colors.white} />
              </View>
              <Text style={styles.title}>Ask WealthFlow AI</Text>
            </View>
            <TouchableOpacity hitSlop={10} onPress={handleClose}>
              <Ionicons
                name="close"
                size={22}
                color={colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Tanyakan sesuatu tentang keuanganmu..."
            placeholderTextColor={colors.outline}
            multiline
            autoFocus
            style={styles.input}
          />

          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.voiceButton}
              activeOpacity={0.85}
              onPress={onVoicePress}
            >
              <Ionicons name="mic-outline" size={20} color={colors.primary} />
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
                    : [colors.outlineVariant, colors.outlineVariant]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="arrow-up" size={20} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: colors.white,
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
    backgroundColor: colors.outlineVariant,
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
  title: { ...typography.titleMd, fontSize: 16, color: colors.onSurface },

  input: {
    ...typography.bodyLg,
    color: colors.onSurface,
    backgroundColor: colors.platinumMist + "4d",
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
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
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
