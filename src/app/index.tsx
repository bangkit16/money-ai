import { Redirect } from "expo-router";

// Root index — landing awal. Langsung arahkan ke tabs; AuthGuard di _layout
// yang memutuskan apakah user belum login (dilempar ke /login) atau sudah.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
