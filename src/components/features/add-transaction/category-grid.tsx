// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const primaryColor = useColor("primary");
  const textColor = useColor("text");
  const whiteColor = useColor("background");
  const secondaryColor = useColor("secondary");

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={primaryColor} />
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
            style={[
              styles.chip,
              { backgroundColor: cardColor, borderColor },
              active && { backgroundColor: primaryColor, borderColor: primaryColor },
              shadow.card,
            ]}
            activeOpacity={0.85}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={16}
              color={active ? whiteColor : secondaryColor}
            />
            <Text
              style={[
                styles.chipText,
                { color: textColor },
                active && { color: whiteColor },
              ]}
            >
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
    borderWidth: 1,
    width: "18%",
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