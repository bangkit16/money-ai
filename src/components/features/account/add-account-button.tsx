import { Text } from "@/components/ui/text";
import { colors, radius, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export function AddAccountButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <MaterialIcons
        name="add-circle-outline"
        size={20}
        color={colors.primary}
      />
      <Text style={styles.text}>Add New Account</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    paddingVertical: 18,
  },
  text: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.primary,
  },
});
