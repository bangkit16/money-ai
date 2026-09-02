// migrated to useColor
import { radius } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

function AddTransactionButton() {
  const whiteColor = useColor("card");
  return (
    <TouchableOpacity
      style={[styles.fab, { borderColor: whiteColor }]}
      onPress={() => router.push("/add-transaction")}
      activeOpacity={0.85}
    >
      <MaterialIcons name="add" size={24} color={whiteColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    borderWidth: 2,
    backgroundColor: "#038303",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#051125",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});

export default AddTransactionButton;