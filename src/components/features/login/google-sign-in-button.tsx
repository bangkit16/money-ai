import { Text } from "@/components/ui/text";
import { colors, radius, shadow, typography } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type GoogleSignInButtonProps = {
  loading: boolean;
  onPress: () => void;
};

export function GoogleSignInButton({
  loading,
  onPress,
}: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, shadow.card]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.onSurface} />
      ) : (
        <>
          <MaterialCommunityIcons
            name="google"
            size={20}
            color={colors.onSurface}
          />
          <Text style={styles.text}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  text: {
    ...typography.titleMd,
    fontSize: 15,
    color: colors.onSurface,
  },
});
