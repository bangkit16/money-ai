import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, Switch, View } from "react-native";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export function SettingToggle({
  icon,
  iconColor,
  title,
  description,
  value,
  onValueChange,
}: Props) {
  const cardBg = useColor("card");
  const border = useColor("border");
  const muted = useColor("textMuted");
  const iconBg = useColor("muted");
  const primary = useColor("primary");

  return (
    <View style={[styles.row, { backgroundColor: cardBg, borderColor: border }, shadow.card]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={[styles.desc, { color: muted }]}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#d1d5db", true: primary }}
        thumbColor={Platform.OS === "ios" ? "#ffffff" : value ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#d1d5db"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  title: { ...typography.titleMd, fontSize: 15 },
  desc: { ...typography.bodySm, fontSize: 12 },
});
