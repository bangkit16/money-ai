// migrated to useColor
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export function TransferCard() {
  const primaryColor = useColor("primary");
  const primaryContainerColor = useColor("primaryContainer");
  const onPrimaryColor = useColor("onPrimary");
  const onPrimaryContainerColor = useColor("onPrimaryContainer");
  const whiteColor = useColor("white");
  return (
    <View
      style={[styles.card, { backgroundColor: "#253b21" }, shadow.heroCard]}
    >
      <Text style={[styles.heroLabel, { color: whiteColor }]}>
        TRANSFER SALDO
      </Text>
      <View
        style={[
          styles.heroDivider,
          { backgroundColor: onPrimaryContainerColor + "33" },
        ]}
      />
      <Button
        variant="default"
        onPress={() =>
          router.push({
            pathname: "/add-transaction",
            params: { type: "TRANSFER" },
          })
        }
        style={[styles.buttonTransfer, { backgroundColor: "#0a2505" }]}
      >
        <Text style={[styles.buttonTransferText, { color: whiteColor }]}>
          Transfer Antar Rekening
        </Text>
        <MaterialIcons name="arrow-forward" size={24} color={whiteColor} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, padding: 24 },
  heroLabel: { ...typography.labelCaps, opacity: 0.8 },
  heroDivider: {
    height: 1,
    marginVertical: 20,
  },
  buttonTransfer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  buttonTransferText: { ...typography.bodyLg },
});
