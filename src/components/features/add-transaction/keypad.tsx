import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
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
  return (
    <View style={styles.keypad}>
      {KEYPAD_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.keypadRow}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.keypadKey}
              activeOpacity={0.6}
              onPress={() => onKeyPress(key)}
            >
              {key === "backspace" ? (
                <MaterialIcons
                  name="backspace"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
              ) : (
                <Text style={styles.keypadKeyText}>{key}</Text>
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
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  keypadKeyText: {
    ...typography.titleMd,
    fontSize: 20,
    color: colors.onSurface,
  },
});
