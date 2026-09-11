import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { radius, shadow, spacing, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  title: string;
  description?: string;
  value?: string;
  onPress?: () => void;
};

export function SettingRow({
  icon,
  iconColor,
  title,
  description,
  value,
  onPress,
}: Props) {
  const cardBg = useColor("card");
  const border = useColor("border");
  const muted = useColor("textMuted");
  const iconBg = useColor("muted");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.row, { backgroundColor: cardBg, borderColor: border }, shadow.card]}
    >
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        {description ? (
          <Text style={[styles.desc, { color: muted }]}>{description}</Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[styles.value, { color: muted }]}>{value}</Text>
      ) : null}
      <MaterialIcons name="chevron-right" size={20} color={muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  title: { ...typography.titleMd, fontSize: 13 },
  desc: { ...typography.bodySm, fontSize: 10 },
  value: { ...typography.bodySm, fontSize: 11 },
  _spacer: { marginBottom: spacing.unit },
});
