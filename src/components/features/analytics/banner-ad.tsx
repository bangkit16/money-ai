import { useEffect, useState } from "react";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { StyleSheet, View } from "react-native";
import { USE_TEST_ADS } from "@/constants/config";
import { initMobileAds } from "@/lib/admob";

const AD_UNIT_ID = USE_TEST_ADS
  ? TestIds.BANNER
  : "ca-app-pub-3230523634633671/5651785410";

export function AnalyticsBannerAd() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initMobileAds().then(() => setIsReady(true));
  }, []);

  if (!isReady) return null;

  return (
    // <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn("[AdMob] Analytics Banner failed to load:", error);
        }}
      />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
