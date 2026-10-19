// migrated to useColor
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import { StyleSheet, View } from "react-native";
import { USE_TEST_ADS } from "@/constants/config";

const AD_UNIT_ID = USE_TEST_ADS ? TestIds.BANNER : "ca-app-pub-3230523634633671/2180052108";

export function ActivityBannerAd() { 
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
});