// migrated to useColor
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const whiteColor = useColor("background");
  return (
    <View style={styles.row}>
      {FILTERS.map((f) => {
        const active = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => onChange(f.key)}
            style={[
              styles.chip,
              { backgroundColor: cardColor, borderColor },
              active && { backgroundColor: primaryColor, borderColor: primaryColor },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: textMutedColor },
                active && { color: whiteColor },
              ]}
            >
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
    borderWidth: 1,
  },
  chipText: { ...typography.labelCaps },
});