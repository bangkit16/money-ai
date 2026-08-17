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

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const isValid = parseFloat(amount) > 0 && category;

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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount input */}
        <View style={styles.amountBlock}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.outlineVariant}
              keyboardType="decimal-pad"
              style={styles.amountInput}
              autoFocus
            />
          </View>
        </View>

        {/* Category grid */}
        <View style={{ marginTop: spacing.gutter }}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const active = category === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => setCategory(cat.key)}
                  style={[
                    styles.categoryItem,
                    shadow.card,
                    active && styles.categoryItemActive,
                  ]}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.categoryIconCircle,
                      {
                        backgroundColor: active
                          ? "rgba(255,255,255,0.2)"
                          : colors.secondaryContainer + "66",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={cat.icon as any}
                      size={20}
                      color={active ? colors.white : colors.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      active && styles.categoryLabelActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Date field */}
        <View style={{ marginTop: spacing.gutter, gap: 8 }}>
          <Text style={styles.label}>Date</Text>
          {/* Ganti dengan date picker native (mis. @react-native-community/datetimepicker) */}
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
              size={18}
              color={colors.outline}
            />
          </View>
        </View>

        {/* Note field */}
        <View style={{ marginTop: spacing.gutter, gap: 8 }}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={3}
            style={[styles.inputSoft, styles.textarea]}
          />
        </View>
      </ScrollView>

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

  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 16,
    paddingBottom: 40,
  },

  label: {
    ...typography.labelCaps,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },

  amountBlock: { alignItems: "center" },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  currencySymbol: {
    ...typography.displayLg,
    fontSize: 36,
    color: colors.primary,
    marginRight: 4,
  },
  amountInput: {
    ...typography.displayLg,
    fontSize: 40,
    color: colors.primary,
    textAlign: "center",
    minWidth: 160,
    padding: 0,
  },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  categoryItem: {
    width: "23%",
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
  },
  categoryItemActive: { backgroundColor: colors.primary },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    ...typography.labelCaps,
    fontSize: 10,
    color: colors.onSurface,
  },
  categoryLabelActive: { color: colors.white },

  inputSoft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputSoftText: { ...typography.bodyLg, color: colors.primary, flex: 1 },
  textarea: {
    alignItems: "flex-start",
    minHeight: 88,
    textAlignVertical: "top",
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
    paddingVertical: 18,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.titleMd, color: colors.white },
});
