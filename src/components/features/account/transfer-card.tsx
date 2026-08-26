import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export function TransferCard() {
  return (
    <View style={[styles.card, styles.heroCard, shadow.heroCard]}>
      <Text style={styles.heroLabel}>TRANSFER SALDO</Text>
      <View style={styles.heroDivider} />
      <Button variant="default" onPress={() => {}} style={styles.buttonTransfer}>
        <Text style={styles.buttonTransferText}>Transfer Antar Rekening</Text>
        <MaterialIcons name="arrow-forward" size={24} color="white" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: 24 },
  heroCard: { backgroundColor: colors.primary },
  heroLabel: { ...typography.labelCaps, color: "rgba(255,255,255,0.6)" },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 20,
  },
  buttonTransfer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#014e25",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  buttonTransferText: { ...typography.bodyLg, color: colors.white },
});
