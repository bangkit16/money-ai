import { colors, radius } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

function AddTransactionButton() {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => router.push("/add-transaction")}
      activeOpacity={0.85}
    >
      <MaterialIcons name="add" size={24} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    // position: "absolute",
    // right: 20,
    // bottom: 10,
    width: 60,
    height: 60,
    borderRadius: radius.full,
    borderColor: colors.white,
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
