import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useColor } from "@/hooks/useColor";
import { StyleSheet, View } from "react-native";

// Kartu profil user yang sedang login (dari Supabase session).
export function ProfileCard() {
  const { session } = useAuth();
  const cardBg = useColor("card");
  const border = useColor("border");
  const muted = useColor("textMuted");
  const primary = useColor("primary");

  const user = session?.user;
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;
  const name = meta.full_name || meta.name || user?.email?.split("@")[0] || "-";
  const email = user?.email ?? "-";
  const avatarUrl = meta.avatar_url || meta.picture;
  const provider = user?.app_metadata?.provider as string | undefined;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }, shadow.card]}>
      {/* <Avatar size={48}>
        {avatarUrl ? (
          <AvatarImage source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar> */}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.email, { color: muted }]} numberOfLines={1}>
          {email}
        </Text>
      </View>
      {provider ? (
        <Text style={[styles.provider, { color: primary }]}>{provider}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  avatar: { width: "100%", height: "100%" },
  body: { flex: 1, gap: 2 },
  name: { ...typography.titleMd, fontSize: 14 },
  email: { ...typography.bodySm, fontSize: 11 },
  provider: {
    ...typography.labelCaps,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
});
