// migrated to useColor
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const borderColor = useColor("border");
  const textMutedColor = useColor("textMuted");
  const mutedBgColor = useColor("muted");
  const textColor = useColor("text");
  return (
    <View style={[styles.wrap, { backgroundColor: mutedBgColor }]}>
      <MaterialIcons
        name="search"
        size={20}
        color={borderColor}
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions..."
        placeholderTextColor={textMutedColor}
        style={[styles.input, { color: textColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    ...typography.bodyLg,
    padding: 0,
  },
});