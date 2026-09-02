// migrated to useColor
import { useState } from "react";
import { radius } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity } from "react-native";
import AiPromptBottomSheet from "./ai/AiPromptBottomSheet";

function AiButton() {
  const [open, setOpen] = useState(false);
  const whiteColor = useColor("card");

  const handleSend = (prompt: string) => {
    // TODO: kirim `prompt` ke sistem AI kamu (API call / store, dll)
    console.log("AI prompt:", prompt);
    setOpen(false);
  };

  const handleVoicePress = () => {
    // TODO: hubungkan ke fitur voice-to-text kamu
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.fabContainer, { borderColor: whiteColor }]}
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={["#26be0b", "#1b8a07", "#47733f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="sparkles" size={18} color={whiteColor} />
        </LinearGradient>
      </TouchableOpacity>

      <AiPromptBottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        onSend={handleSend}
        onVoicePress={handleVoicePress}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 2,
    // Efek Shadow/Elevation dipindahkan ke container luar agar tidak terpotong overflow
    shadowColor: "#051125",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: radius.full - 2, // Dikurangi borderWidth agar melengkung sempurna di dalam border
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    position: "absolute",
    top: -12,
    left: 12,
  },
});

export default AiButton;