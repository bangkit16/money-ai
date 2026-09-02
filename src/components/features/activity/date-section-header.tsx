import { colors, typography } from "@/constants/theme";
import type { DateLabel } from "@/components/features/activity/utils";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

export function DateSectionHeader({ label }: { label: DateLabel }) {
  const isRelative = label.kind === "relative";
  return (
    <View style={styles.row}>
      <Text style={[styles.text, isRelative ? styles.relative : styles.absolute]}>
        {isRelative ? `${label.text} · ${label.dateText}` : label.text}
      </Text>
      <View style={styles.line} />
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
  text: { color: colors.onSurfaceVariant },
  relative: { ...typography.labelCaps },
  absolute: { ...typography.labelCaps, textTransform: "none" as const },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant + "4d",
  },
});
