import { Text } from "@/components/ui/text";
import { typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { CURRENCIES, useSettings } from "@/providers/settings-provider";
import { StyleSheet, View } from "react-native";
import { formatAmountInput } from "@/utils/formatAmountInput";

export function AmountDisplay({ amount }: { amount: string }) {
  const { currency } = useSettings();
  const t = useT();
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const primaryColor = useColor("primary");
  const display = amount.length > 0 ? formatAmountInput(amount) : "0";
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "Rp";
  return (
    <View style={styles.block}>
      <Text style={[styles.label, { color: onSurfaceVariantColor }]}>{t("add.amount")}</Text>
      <View style={styles.row}>
        <Text style={[styles.currencySymbol, { color: primaryColor }]}>{symbol}</Text>
        <Text style={[styles.value, { color: primaryColor }]}>{display}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { alignItems: "center", paddingVertical: 4 },
  label: {
    ...typography.labelCaps,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    marginRight: 4,
  },
  value: {
    ...typography.displayLg,
    fontSize: 40,
    maxWidth: "100%",
  },
});
