// migrated to useColor
import { radius, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native"; // Mengganti View dengan ScrollView
import { Text } from "@/components/ui/text";

type TxType = "INCOME" | "EXPENSE" | "TRANSFER";

const FILTERS: { key: "all" | TxType; labelKey: string }[] = [
  { key: "all", labelKey: "activity.filterAll" },
  { key: "EXPENSE", labelKey: "activity.filterExpenses" },
  { key: "INCOME", labelKey: "activity.filterIncome" },
  { key: "TRANSFER", labelKey: "activity.filterTransfer" },
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
  const t = useT();

  return (
    <ScrollView
      horizontal // Mengaktifkan scroll horizontal
      showsHorizontalScrollIndicator={false} // Menyembunyikan scrollbar agar tampilan lebih bersih
      contentContainerStyle={styles.scrollContainer} // Menggunakan contentContainerStyle untuk layouting item di dalamnya
    >
      {FILTERS.map((f) => {
        const active = activeFilter === f.key;
        return (
          <TouchableOpacity
            key={f.key}
            onPress={() => onChange(f.key)}
            style={[
              styles.chip,
              { backgroundColor: cardColor, borderColor },
              active && {
                backgroundColor: primaryColor,
                borderColor: primaryColor,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: textMutedColor },
                active && { color: whiteColor },
              ]}
            >
              {t(f.labelKey)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Menggunakan contentContainerStyle pada ScrollView
  scrollContainer: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 16, // Opsional: memberi sedikit jarak di ujung kiri dan kanan saat di-swipe
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    ...typography.labelCaps,
  },
});
