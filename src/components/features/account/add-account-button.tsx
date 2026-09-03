// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

export function AddAccountButton({ onPress }: { onPress: () => void }) {
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const t = useT();
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons
        name="add-circle-outline"
        size={20}
        color={primaryColor}
      />
      <Text style={[styles.text, { color: primaryColor }]}>{t("account.addNew")}</Text>
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
    borderRadius: radius.xl,
    paddingVertical: 18,
  },
  text: {
    ...typography.titleMd,
    fontSize: 15,
  },
});