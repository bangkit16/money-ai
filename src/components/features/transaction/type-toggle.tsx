// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const TRANSACTION_TYPES = [
  { key: "EXPENSE", labelKey: "type.expense", icon: "arrow-upward" },
  { key: "INCOME", labelKey: "type.income", icon: "arrow-downward" },
  { key: "TRANSFER", labelKey: "type.transfer", icon: "swap-horiz" },
] as const;

export type TransactionTypeKey = (typeof TRANSACTION_TYPES)[number]["key"];

type TypeToggleProps = {
  value: TransactionTypeKey;
  onChange: (key: TransactionTypeKey) => void;
};

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const textMutedColor = useColor("textMuted");
  const whiteColor = useColor("background");
  const t = useT();
  return (
    <View style={styles.typeRow}>
      {TRANSACTION_TYPES.map((type) => {
        const active = value === type.key;
        return (
          <TouchableOpacity
            key={type.key}
            onPress={() => onChange(type.key)}
            style={[
              styles.typeButton,
              { backgroundColor: cardColor, borderColor },
              active && { backgroundColor: primaryColor, borderColor: primaryColor },
              shadow.card,
            ]}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={type.icon as any}
              size={16}
              color={active ? whiteColor : textMutedColor}
            />
            <Text
              style={[
                styles.typeButtonText,
                { color: textMutedColor },
                active && { color: whiteColor },
              ]}
            >
              {type.labelKey.startsWith("type.") ? t(type.labelKey) : type.labelKey}
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
    borderWidth: 1,
  },
  typeButtonText: {
    ...typography.labelCaps,
    fontSize: 9,
  },
});