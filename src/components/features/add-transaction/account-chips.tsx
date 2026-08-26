import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
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
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading accounts...</Text>
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
            style={[styles.chip, active && styles.chipActive]}
            activeOpacity={0.85}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadow.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.labelCaps,
    fontSize: 11,
    color: colors.onSurface,
  },
  chipTextActive: { color: colors.white },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "100%",
    gap: 8,
  },
  loadingText: { fontSize: 14, color: colors.secondary },
});
