// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import type { AccountOptionRow } from "@/services/addTransactionService";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type AccountChipsProps = {
  accounts: AccountOptionRow[] | undefined;
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (id: number | null) => void;
};

export function AccountChips({
  accounts,
  selectedId,
  isLoading,
  onSelect,
}: AccountChipsProps) {
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const textColor = useColor("text");
  const whiteColor = useColor("background");
  const textMutedColor = useColor("textMuted");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={primaryColor} />
        <Text style={[styles.loadingText, { color: textMutedColor }]}>Loading accounts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
    >
      {accounts?.map((acc) => {
        const active = selectedId === acc.id;
        return (
          <TouchableOpacity
            key={acc.id}
            onPress={() => onSelect(acc.id)}
            style={[
              styles.chip,
              { backgroundColor: cardColor, borderColor },
              active && { backgroundColor: primaryColor, borderColor: primaryColor },
              shadow.card,
            ]}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.chipText,
                { color: textColor },
                active && { color: whiteColor },
              ]}
            >
              {acc.account_name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.labelCaps,
    fontSize: 11,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "100%",
    gap: 8,
  },
  loadingText: { fontSize: 14 },
});