import { Text } from "@/components/ui/text";
import { colors, radius, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type SaveButtonProps = {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
};

export function SaveButton({ disabled, loading, onPress }: SaveButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Text style={styles.text}>Save Transaction</Text>
          <MaterialIcons name="check-circle" size={20} color={colors.white} />
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  disabled: { opacity: 0.4 },
  text: { ...typography.titleMd, color: colors.white },
});
