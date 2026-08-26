import { colors, radius, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.wrap}>
      <MaterialIcons
        name="search"
        size={20}
        color={colors.outline}
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search transactions..."
        placeholderTextColor={colors.outline}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    ...typography.bodyLg,
    color: colors.onSurface,
    padding: 0,
  },
});
