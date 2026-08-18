import { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  colors,
  typography,
  radius,
  spacing,
  shadow,
} from "../constants/theme";
import { Text } from "@/components/ui/text";

const CATEGORIES = [
  { key: "shopping", icon: "shopping-bag", label: "Shopping" },
  { key: "food", icon: "restaurant", label: "Food" },
  { key: "travel", icon: "flight", label: "Travel" },
  { key: "bills", icon: "receipt", label: "Bills" },
  { key: "fun", icon: "movie", label: "Fun" },
  { key: "health", icon: "medical-services", label: "Health" },
  { key: "auto", icon: "directions-car", label: "Auto" },
  { key: "others", icon: "more-horiz", label: "Others" },
];

const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "backspace"],
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const isValid = parseFloat(amount) > 0 && category;

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (key === ".") {
      if (amount.includes(".")) return; // cegah lebih dari satu titik desimal
      setAmount((prev) => (prev.length === 0 ? "0." : prev + "."));
      return;
    }
    // batasi maksimal 2 digit di belakang koma
    const decimalPart = amount.split(".")[1];
    if (decimalPart && decimalPart.length >= 2) return;
    // cegah leading zero ganda (mis. "00")
    if (amount === "0") {
      setAmount(key);
      return;
    }
    setAmount((prev) => prev + key);
  };

  const handleSave = () => {
    if (!isValid) return;

    // TODO: ganti dengan penyimpanan data asli (state global / API)
    const payload = {
      amount: parseFloat(amount),
      category,
      date,
      note,
    };
    console.log("New transaction:", payload);

    Alert.alert("Tersimpan", "Transaksi berhasil disimpan.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.headerBtn}
        >
          <MaterialIcons name="close" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={styles.body}>
        {/* Bagian atas yang bisa discroll: amount, category, date, note */}
        <ScrollView
          style={styles.topScroll}
          contentContainerStyle={styles.topScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Amount display (bukan input keyboard, hanya tampilan) */}
          <View style={styles.amountBlock}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text
                style={styles.amountValue}
                // numberOfLines={1}
                // adjustsFontSizeToFit
              >
                {amount.length > 0 ? amount : "0"}
              </Text>
            </View>
          </View>

          {/* Category — horizontal chip agar hemat ruang vertikal */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryRow}
            >
              {CATEGORIES.map((cat) => {
                const active = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    onPress={() => setCategory(cat.key)}
                    style={[
                      styles.categoryChip,
                      active && styles.categoryChipActive,
                    ]}
                    activeOpacity={0.85}
                  >
                    <MaterialIcons
                      name={cat.icon as any}
                      size={16}
                      color={active ? colors.white : colors.secondary}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        active && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Date */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputSoft}>
              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.outline}
                style={styles.inputSoftText}
              />
              <MaterialIcons
                name="calendar-today"
                size={16}
                color={colors.outline}
              />
            </View>
          </View>

          {/* Note */}
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What was this for?"
              placeholderTextColor={colors.outline}
              style={styles.inputSoft}
            />
          </View>
        </ScrollView>

        {/* Numeric keypad — fixed, tidak ikut scroll */}
        <View style={styles.keypad}>
          {KEYPAD_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={styles.keypadKey}
                  activeOpacity={0.6}
                  onPress={() => handleKeyPress(key)}
                >
                  {key === "backspace" ? (
                    <MaterialIcons
                      name="backspace"
                      size={20}
                      color={colors.onSurfaceVariant}
                    />
                  ) : (
                    <Text style={styles.keypadKeyText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Footer action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isValid}
          activeOpacity={0.9}
        >
          <Text style={styles.saveButtonText}>Save Transaction</Text>
          <MaterialIcons name="check-circle" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 54 : 24,
    paddingBottom: 12,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { ...typography.titleMd, color: colors.primary },

  body: { flex: 1 },

  topScroll: { flexGrow: 0 },
  topScrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 16,
  },

  label: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },

  amountBlock: { alignItems: "center", paddingVertical: 4 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencySymbol: {
    ...typography.headlineLg,
    fontSize: 28,
    color: colors.primary,
    marginRight: 4,
  },
  amountValue: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.primary,
    maxWidth: "100%",
  },

  fieldBlock: {},

  categoryRow: { gap: 8, paddingRight: 4 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant + "4d",
    ...shadow.card,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurface,
  },
  categoryChipTextActive: { color: colors.white },

  inputSoft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputSoftText: { ...typography.bodyLg, color: colors.primary, flex: 1 },

  keypad: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 4,
    gap: 8,
  },
  keypadRow: { flexDirection: "row", gap: 8 },
  keypadKey: {
    flex: 1,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  keypadKeyText: {
    ...typography.titleMd,
    fontSize: 20,
    color: colors.onSurface,
  },

  footer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    backgroundColor: colors.background,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, color: colors.white },
});
