import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const { formatCurrency } = useFormatCurrency();
  const cardColor = useColor("card");
  const primaryColor = useColor("primary");
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const platinumMistColor = useColor("platinumMist");
  if (items.length === 0) {
    return (
      <View style={[styles.card, shadow.card, styles.empty, { backgroundColor: cardColor }]}>
        <Text style={[styles.emptyText, { color: onSurfaceVariantColor }]}>No spending yet for this month.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, shadow.card, { padding: 0, backgroundColor: cardColor }]}>
      {items.map((cat, i) => (
        <View
          key={cat.name}
          style={[
            styles.catRow,
            i !== items.length - 1 && { borderBottomColor: platinumMistColor + "4d", borderBottomWidth: 1 },
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
              <Text style={[styles.catName, { color: primaryColor }]}>{cat.name}</Text>
              <Text style={[styles.catMeta, { color: onSurfaceVariantColor }]}>{cat.subtitle}</Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.catAmount, { color: primaryColor }]}>
              {formatCurrency(cat.amount)}
            </Text>
            <View style={[styles.catProgressTrack, { backgroundColor: platinumMistColor + "4d" }]}>
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
  card: { borderRadius: radius.xl, padding: 24 },

  catRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
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
  },
  catMeta: { ...typography.bodySm },
  catAmount: {
    ...typography.bodyLg,
    fontWeight: "600",
  },
  catProgressTrack: {
    width: 96,
    height: 4,
    borderRadius: radius.full,
    marginTop: 8,
    overflow: "hidden",
  },
  catProgressFill: { height: "100%", borderRadius: radius.full },

  empty: { alignItems: "center", paddingVertical: 32 },
  emptyText: { ...typography.bodyLg },
});
