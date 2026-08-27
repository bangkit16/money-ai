import { useRef, useCallback, useEffect } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
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

        const rawDigits = raw.replace(/\D/g, "");
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
      <Text style={styles.label}>Amount</Text>
      <View style={styles.inputRow}>
        <Text style={styles.currencySymbol}>Rp</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={formatted}
          onChangeText={handleChangeText}
          onSelectionChange={handleSelectionChange}
          onFocus={handleFocus}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={colors.outlineVariant}
          selectionColor={colors.primary}
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
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    ...shadow.card,
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...typography.displayLg,
    fontSize: 36,
    color: colors.primary,
    minWidth: 0,
  },
});
