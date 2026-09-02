import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { CURRENCIES, useSettings } from "@/providers/settings-provider";
import { radius, spacing, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CurrencyPickerSheet({ visible, onClose }: Props) {
  const { currency, setCurrency } = useSettings();
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
          <Text style={styles.title}>Currency</Text>
          <View style={styles.list}>
            {CURRENCIES.map((c) => {
              const active = currency === c.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  activeOpacity={0.85}
                  style={[styles.option, { borderColor: border }]}
                  onPress={() => {
                    setCurrency(c.code);
                    onClose();
                  }}
                >
                  <Text style={styles.symbol}>{c.symbol}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.code}>{c.code}</Text>
                  </View>
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
  symbol: { ...typography.titleMd, fontSize: 18, width: 36, textAlign: "center" },
  code: { ...typography.bodyLg },
  cancel: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  cancelText: { ...typography.titleMd, fontSize: 15 },
});
