import { useRef, useCallback } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { CURRENCIES, useSettings } from "@/providers/settings-provider";
import { formatAmountInput, unformatAmountInput } from "@/utils/formatAmountInput";

type FormattedAmountInputProps = {
  value: string;
  onChange: (rawValue: string) => void;
  placeholder?: string;
};

export function FormattedAmountInput({
  value,
  onChange,
  placeholder = "0",
}: FormattedAmountInputProps) {
  const { currency } = useSettings();
  const onSurfaceVariantColor = useColor("onSurfaceVariant");
  const primaryColor = useColor("primary");
  const outlineVariantColor = useColor("outlineVariant");
  const cardColor = useColor("card");
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "Rp";
  const inputRef = useRef<TextInput>(null);
  const lastSelection = useRef({ start: 0, end: 0 });

  const formatted = formatAmountInput(value);

  const handleChangeText = useCallback(
    (text: string) => {
      const raw = unformatAmountInput(text);
      const newFormatted = formatAmountInput(raw);
      onChange(raw);

      requestAnimationFrame(() => {
        if (!inputRef.current) return;

        const newLen = newFormatted.length;
        let newPos = lastSelection.current.start;

        if (newPos > newLen) newPos = newLen;
        if (newPos < 0) newPos = 0;

        inputRef.current.setNativeProps({
          selection: { start: newPos, end: newPos },
        });
      });
    },
    [onChange]
  );

  const handleSelectionChange = useCallback(
    (event: { nativeEvent: { selection: { start: number; end: number } } }) => {
      lastSelection.current = event.nativeEvent.selection;
    },
    []
  );

  const handleFocus = useCallback(() => {
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const pos = formatted.length;
        inputRef.current.setNativeProps({
          selection: { start: pos, end: pos },
        });
      }
    });
  }, [formatted]);

  return (
    <View style={styles.block}>
      <Text style={[styles.label, { color: onSurfaceVariantColor }]}>Amount</Text>
      <View style={[styles.inputRow, { backgroundColor: cardColor }, shadow.card]}>
        <Text style={[styles.currencySymbol, { color: primaryColor }]}>{symbol}</Text>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: primaryColor }]}
          value={formatted}
          onChangeText={handleChangeText}
          onSelectionChange={handleSelectionChange}
          onFocus={handleFocus}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={outlineVariantColor}
          selectionColor={primaryColor}
          maxLength={15}
        />
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...typography.displayLg,
    fontSize: 36,
    minWidth: 0,
  },
});
