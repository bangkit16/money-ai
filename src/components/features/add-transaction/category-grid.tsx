import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import type { CategoryRow } from "@/services/addTransactionService";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type CategoryGridProps = {
  categories: CategoryRow[] | undefined;
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (id: number) => void;
};

export function CategoryGrid({
  categories,
  selectedId,
  isLoading,
  onSelect,
}: CategoryGridProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {categories?.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={[styles.chip, active && styles.chipActive]}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={16}
              color={active ? colors.white : colors.secondary}
            />
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {cat.category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: 8,
    columnGap: "2.5%",
  },
  chip: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    width: "18%",
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
