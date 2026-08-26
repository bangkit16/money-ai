import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.button, shadow.card]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MaterialIcons name="logout" size={20} color={colors.error} />
      <Text style={styles.text}>Log Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  text: { ...typography.titleMd, fontSize: 15, color: colors.error },
});
