import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useT } from "@/i18n";

export function LogoutButton({ onPress }: { onPress: () => void }) {
  const cardBg = useColor("card");
  const error = useColor("error");
  const t = useT();
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: cardBg, borderColor: error }, shadow.card]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <MaterialIcons name="logout" size={20} color={error} />
      <Text style={[styles.text, { color: error }]}>{t("settings.logout")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 12,
  },
  text: { ...typography.titleMd, fontSize: 12 },
});
