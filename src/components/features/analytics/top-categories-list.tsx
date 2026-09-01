import { formatCurrency } from "@/utils/formatCurrency";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export type TopCategory = {
  icon: string;
  name: string;
  subtitle: string;
  amount: number;
  percent: number;
  color: string;
};

type Props = {
  items: TopCategory[];
};

export function TopCategoriesList({ items }: Props) {
  if (items.length === 0) {
    return (
      <View style={[styles.card, shadow.card, styles.empty]}>
        <Text style={styles.emptyText}>No spending yet for this month.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, shadow.card, { padding: 0 }]}>
      {items.map((cat, i) => (
        <View
          key={cat.name}
          style={[
            styles.catRow,
            i !== items.length - 1 && styles.catRowDivider,
          ]}
        >
          <View style={styles.catLeft}>
            <View
              style={[
                styles.catIconCircle,
                { backgroundColor: cat.color + "1a" },
              ]}
            >
              <MaterialIcons
                name={cat.icon as any}
                size={20}
                color={cat.color}
              />
            </View>
            <View>
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catMeta}>{cat.subtitle}</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.catAmount}>
              {formatCurrency(cat.amount)}
            </Text>
            <View style={styles.catProgressTrack}>
              <View
                style={[
                  styles.catProgressFill,
                  { width: `${cat.percent}%`, backgroundColor: cat.color },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },

  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  catRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.platinumMist + "4d",
  },
  catLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flexShrink: 1,
  },
  catIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  catName: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.primary,
  },
  catMeta: { ...typography.bodySm, color: colors.onSurfaceVariant },
  catAmount: {
    ...typography.bodyLg,
    fontWeight: "600",
    color: colors.primary,
  },
  catProgressTrack: {
    width: 96,
    height: 4,
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.full,
    marginTop: 8,
    overflow: "hidden",
  },
  catProgressFill: { height: "100%", borderRadius: radius.full },

  empty: { alignItems: "center", paddingVertical: 32 },
  emptyText: { ...typography.bodyMd, color: colors.onSurfaceVariant },
});