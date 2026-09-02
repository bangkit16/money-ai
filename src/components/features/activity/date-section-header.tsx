// migrated to useColor
import { typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import type { DateLabel } from "@/components/features/activity/utils";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

export function DateSectionHeader({ label }: { label: DateLabel }) {
  const isRelative = label.kind === "relative";
  const textMutedColor = useColor("textMuted");
  const borderColor = useColor("border");
  return (
    <View style={styles.row}>
      <Text
        style={[styles.text, { color: textMutedColor }, isRelative ? styles.relative : styles.absolute]}
      >
        {isRelative ? `${label.text} · ${label.dateText}` : label.text}
      </Text>
      <View style={[styles.line, { backgroundColor: borderColor }]} />
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
});