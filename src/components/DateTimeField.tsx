import { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, spacing, typography } from "@/constants/theme";

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

type Stage = "date" | "time" | null;

function formatLabel(date: Date) {
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DateTimeField({ value, onChange }: Props) {
  const [stage, setStage] = useState<Stage>(null);

  const open = () => setStage("date");
  const close = () => setStage(null);

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      if (event.type !== "set" || !selected) {
        setStage(null);
        return;
      }
      if (stage === "date") {
        const updated = new Date(value);
        updated.setFullYear(
          selected.getFullYear(),
          selected.getMonth(),
          selected.getDate(),
        );
        onChange(updated);
        setStage("time"); // lanjut otomatis ke pemilih jam, tanpa perlu tap dua kali
      } else if (stage === "time") {
        const updated = new Date(value);
        updated.setHours(selected.getHours(), selected.getMinutes());
        onChange(updated);
        setStage(null);
      }
      return;
    }

    // iOS pakai mode "datetime" -> tanggal & jam sudah satu spinner gabungan
    if (selected) onChange(selected);
  };

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={open} activeOpacity={0.7}>
        <Text style={styles.fieldText} numberOfLines={1}>
          {formatLabel(value)}
        </Text>
        <MaterialIcons name="event" size={16} color={colors.outline} />
      </TouchableOpacity>

      {Platform.OS === "android" && stage && (
        <DateTimePicker
          key={stage} // paksa remount biar dialog Android kebuka lagi saat pindah date -> time
          value={value}
          mode={stage}
          display="default"
          onChange={handleChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={!!stage}
          transparent
          animationType="slide"
          onRequestClose={close}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.backdrop}
              activeOpacity={1}
              onPress={close}
            />
            <View style={[styles.sheet, shadow.heroCard]}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={close}>
                  <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Select Date & Time</Text>
                <TouchableOpacity onPress={close}>
                  <Text style={styles.done}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode="datetime"
                display="spinner"
                onChange={handleChange}
                style={{ height: 200 }}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.platinumMist + "4d",
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  fieldText: { ...typography.bodySm, color: colors.primary, flexShrink: 1 },

  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(5,17,37,0.5)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceContainerHighest,
  },
  title: { ...typography.titleMd, fontSize: 15, color: colors.onSurface },
  cancel: { ...typography.bodyLg, color: colors.onSurfaceVariant },
  done: { ...typography.bodyLg, fontWeight: "600", color: colors.primary },
});
