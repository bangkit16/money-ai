import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { useModeContext, type Mode } from "@/providers/mode-provider";
import { radius, spacing, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

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
  const cardBg = useColor("card");
  const border = useColor("border");
  const muted = useColor("textMuted");
  const primary = useColor("primary");
  const overlay = "rgba(0,0,0,0.45)";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.overlay, { backgroundColor: overlay }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: cardBg, borderColor: border }]}
          onPress={() => {}}
        >
          <View style={[styles.handle, { backgroundColor: muted }]} />
          <Text style={styles.title}>Theme</Text>
          <View style={styles.list}>
            {OPTIONS.map((opt) => {
              const active = modeCtx?.mode === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.85}
                  style={[styles.option, { borderColor: border }]}
                  onPress={() => {
                    modeCtx?.setMode(opt.value);
                    onClose();
                  }}
                >
                  <MaterialIcons
                    name={opt.icon}
                    size={22}
                    color={active ? primary : muted}
                  />
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                  {active ? <MaterialIcons name="check" size={20} color={primary} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.cancel, { borderColor: border }]}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.marginMobile,
    paddingBottom: 32,
    gap: 12,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  title: { ...typography.titleMd, marginBottom: 4 },
  list: { gap: 4 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  optionLabel: { ...typography.bodyLg, flex: 1 },
  cancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  cancelText: { ...typography.titleMd, fontSize: 15 },
});
