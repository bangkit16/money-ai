import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// TODO: sesuaikan value ini dengan value enum "transaction_type" di DB kamu
const TRANSACTION_TYPES = [
  { key: "EXPENSE", label: "Expense", icon: "arrow-upward" },
  { key: "INCOME", label: "Income", icon: "arrow-downward" },
] as const;

export type TransactionTypeKey = (typeof TRANSACTION_TYPES)[number]["key"];

type TypeToggleProps = {
  value: TransactionTypeKey;
  onChange: (key: TransactionTypeKey) => void;
};

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <View style={styles.typeRow}>
      {TRANSACTION_TYPES.map((t) => {
        const active = value === t.key;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onChange(t.key)}
            style={[styles.typeButton, active && styles.typeButtonActive]}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={t.icon as any}
              size={16}
              color={active ? colors.white : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.typeButtonText,
                active && styles.typeButtonTextActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  typeRow: { flexDirection: "row", gap: 8 },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadow.card,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  typeButtonTextActive: { color: colors.white },
});
