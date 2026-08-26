import { colors, radius, typography } from "@/constants/theme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/ui/text";

type TxType = "INCOME" | "EXPENSE";

const FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "EXPENSE", label: "Expenses" },
  { key: "INCOME", label: "Income" },
];

type FilterChipsProps = {
  activeFilter: "all" | TxType;
  onChange: (key: "all" | TxType) => void;
};

export function FilterChips({ activeFilter, onChange }: FilterChipsProps) {
  return (
    <View style={styles.row}>
      {FILTERS.map((f) => {
        const active = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => onChange(f.key)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant + "4d",
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.labelCaps, color: colors.onSurfaceVariant },
  chipTextActive: { color: colors.white },
});
