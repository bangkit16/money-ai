// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["000", "0", "backspace"],
];

type KeypadProps = {
  onKeyPress: (key: string) => void;
};

export function Keypad({ onKeyPress }: KeypadProps) {
  const cardColor = useColor("card");
  const textColor = useColor("text");
  const textMutedColor = useColor("textMuted");
  return (
    <View style={styles.keypad}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[styles.keypadKey, { backgroundColor: cardColor }, shadow.card]}
              activeOpacity={0.6}
              onPress={() => onKeyPress(key)}
            >
              {key === "backspace" ? (
                <MaterialIcons
                  name="backspace"
                  size={20}
                  color={textMutedColor}
                />
              ) : (
                <Text style={[styles.keypadKeyText, { color: textColor }]}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keypad: { paddingTop: 16, gap: 8 },
  keypadRow: { flexDirection: "row", gap: 8 },
  keypadKey: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  keypadKeyText: {
    ...typography.titleMd,
    fontSize: 20,
  },
});