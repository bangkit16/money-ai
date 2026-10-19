import { Text } from "@/components/ui/text";
import { radius, shadow, typography } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useColor } from "@/hooks/useColor";
import { useT } from "@/i18n";
import { isPro$, aiQuota$ } from "@/store/profile$";
import { useSelector } from "@legendapp/state/react";
import { StyleSheet, View } from "react-native";

// Kartu profil user yang sedang login (dari Supabase session).
export function ProfileCard() {
  const { session } = useAuth();
  const t = useT();
  const cardBg = useColor("card");
  const border = useColor("border");
  const muted = useColor("textMuted");
  const primary = useColor("primary");

  const isPro = useSelector(isPro$);
  const quota = useSelector(aiQuota$);

  const user = session?.user;
  const meta = (user?.user_metadata ?? {}) as Record<string, string>;
  const name = meta.full_name || meta.name || user?.email?.split("@")[0] || "-";
  const email = user?.email ?? "-";
  const provider = user?.app_metadata?.provider as string | undefined;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }, shadow.card]}>
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {/* <View style={[styles.badge, isPro ? styles.proBadge : styles.freeBadge]}>
            <Text style={[styles.badgeText, isPro ? styles.proBadgeText : styles.freeBadgeText]}>
              {isPro ? "PRO" : "FREE"}
            </Text>
          </View> */}
        </View>
        <Text style={[styles.email, { color: muted }]} numberOfLines={1}>
          {email}
        </Text>
        <Text style={[styles.quotaText, { color: muted }]}>
          {t("profile.aiQuota", { remaining: quota.remaining, max: quota.max })}
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
    padding: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  body: { flex: 1, gap: 2 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: { ...typography.titleMd, fontSize: 14 },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  proBadge: {
    backgroundColor: "#EAB308",
  },
  freeBadge: {
    backgroundColor: "#71717A22",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  proBadgeText: {
    color: "#FFFFFF",
  },
  freeBadgeText: {
    color: "#71717A",
  },
  email: { ...typography.bodySm, fontSize: 11 },
  quotaText: {
    ...typography.bodySm,
    fontSize: 11,
    marginTop: 2,
  },
  provider: {
    ...typography.labelCaps,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: "hidden",
  },
});
