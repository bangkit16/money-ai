// migrated to useColor
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
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
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const textColor = useColor("text");
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: cardColor, borderColor }, shadow.card]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          <MaterialCommunityIcons
            name="google"
            size={20}
            color={textColor}
          />
          <Text style={[styles.text, { color: textColor }]}>Continue with Google</Text>
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
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 16,
  },
  text: {
    ...typography.titleMd,
    fontSize: 15,
  },
});