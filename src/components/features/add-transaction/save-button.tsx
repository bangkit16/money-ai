// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
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
  const primaryColor = useColor("primary");
  const whiteColor = useColor("background");
  const t = useT();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: primaryColor }, (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={whiteColor} />
      ) : (
        <>
          <Text style={[styles.text, { color: whiteColor }]}>{t("add.saveButton")}</Text>
          <MaterialIcons name="check-circle" size={20} color={whiteColor} />
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
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  disabled: { opacity: 0.4 },
  text: { ...typography.titleMd },
});