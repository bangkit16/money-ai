import { FlatList, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/text";
import { spacing } from "@/constants/theme";
import { useColor } from "@/hooks/useColor";
import { MaterialIcons } from "@expo/vector-icons";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'transfer' | 'bill' | 'alert' | 'promo';
  icon: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Transfer Berhasil",
    message: "Transfer ke Bank BCA sebesar Rp 500.000 berhasil diproses",
    time: "2 jam lalu",
    read: false,
    type: 'transfer',
    icon: 'send',
  },
  {
    id: "2",
    title: "Tagihan Dibayar",
    message: "Tagihan PLN November 2024 berhasil dibayar secara otomatis",
    time: "1 hari lalu",
    read: true,
    type: 'bill',
    icon: 'receipt',
  },
  {
    id: "3",
    title: "Saldo Tidak Cukup",
    message: "Transfer gagal, saldo tidak mencukupi. Silakan tambah saldo",
    time: "3 hari lalu",
    read: true,
    type: 'alert',
    icon: 'warning',
  },
  {
    id: "4",
    title: "Pengeluaran Bulanan",
    message: "Pengeluaran bulan ini melebihi rata-rata 15% dari bulan lalu",
    time: "5 hari lalu",
    read: true,
    type: 'alert',
    icon: 'trending-up',
  },
  {
    id: "5",
    title: "Promo Akhir Bulan",
    message: "Dapatkan cashback 10% untuk semua transfer di atas Rp 1.000.000",
    time: "1 minggu lalu",
    read: false,
    type: 'promo',
    icon: 'local-offer',
  },
  {
    id: "6",
    title: "Top Up Berhasil",
    message: "Top up e-wallet sebesar Rp 1.000.000 sudah masuk",
    time: "2 minggu lalu",
    read: true,
    type: 'transfer',
    icon: 'account-balance-wallet',
  },
  {
    id: "7",
    title: "Batas Pengeluaran",
    message: "Anda telah mencapai 80% dari batas pengeluaran bulanan",
    time: "1 bulan lalu",
    read: true,
    type: 'alert',
    icon: 'speed',
  },
  {
    id: "11",
    title: "Batas Pengeluaran",
    message: "Anda telah mencapai 80% dari batas pengeluaran bulanan",
    time: "1 bulan lalu",
    read: true,
    type: 'alert',
    icon: 'speed',
  },
  {
    id: "10",
    title: "Batas Pengeluaran",
    message: "Anda telah mencapai 80% dari batas pengeluaran bulanan",
    time: "1 bulan lalu",
    read: true,
    type: 'alert',
    icon: 'speed',
  },
  {
    id: "8",
    title: "Batas Pengeluaran",
    message: "Anda telah mencapai 80% dari batas pengeluaran bulanan",
    time: "1 bulan lalu",
    read: true,
    type: 'alert',
    icon: 'speed',
  },
  {
    id: "9",
    title: "Batas Pengeluaran",
    message: "Anda telah mencapai 80% dari batas pengeluaran bulanan",
    time: "1 bulan lalu",
    read: true,
    type: 'alert',
    icon: 'speed',
  },
];

export function NotificationList() {
  const bgColor = useColor("background");
  const textColor = useColor("text");
  const mutedColor = useColor("textMuted");
  const primaryColor = useColor("primary");
  const cardBg = useColor("card");
  const borderColor = useColor("border");

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={[styles.item, { backgroundColor: bgColor }]}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconWrapper, { backgroundColor: primaryColor + '20' }]}>
          <MaterialIcons name={item.icon as any} size={20} color={primaryColor} />
        </View>
      </View>
      <View style={[styles.content, { borderBottomColor: borderColor }]}>
        <View style={styles.contentHeader}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: primaryColor }]} />}
          </View>
          <Text style={[styles.time, { color: mutedColor }]}>{item.time}</Text>
        </View>
        <Text style={[styles.message, { color: mutedColor }]}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={MOCK_NOTIFICATIONS}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={[styles.container, { backgroundColor: bgColor }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // content: {
  //   padding: 0,
  // },
  item: {
    flexDirection: "row",
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});