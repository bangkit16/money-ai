import { colors, typography } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";

export function DateSectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{title}</Text>
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
  text: { ...typography.titleMd, color: colors.onSurfaceVariant },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant + "4d",
  },
});
