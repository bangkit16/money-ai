// migrated to useColor
import type { DateLabel } from "@/components/features/activity/utils";
import { Text } from "@/components/ui/text";
import { typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { StyleSheet, View } from "react-native";

export function DateSectionHeader({
  label,
  total,
}: {
  label: DateLabel;
  total: number;
}) {
  const isRelative = label.kind === "relative";
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  const errorColor = useColor("error");
  const successColor = useColor("successGreen");
  const { formatCurrency } = useFormatCurrency();
  const totalColor = total >= 0 ? successColor : errorColor;
  const totalPrefix = total >= 0 ? "+" : "-";
  return (
    <View style={styles.row}>
      <Text
        style={[
          styles.text,
          { color: textMutedColor },
          isRelative ? styles.relative : styles.absolute,
        ]}
      >
        {isRelative ? `${label.text} · ${label.dateText}` : label.text}
      </Text>
      <View style={[styles.line, { backgroundColor: borderColor }]} />
      <Text style={[styles.total, { color: totalColor }]} numberOfLines={1}>
        {totalPrefix}
        {formatCurrency(Math.abs(total))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  text: {},
  relative: { ...typography.labelCaps },
  absolute: { ...typography.labelCaps, textTransform: "none" as const },
  line: {
    flex: 1,
    height: 1,
  },
  total: {
    ...typography.bodySm,
  },
});
