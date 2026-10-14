import mobileAds from "react-native-google-mobile-ads";

export function initMobileAds() {
  mobileAds()
    .initialize()
    .catch((err) => {
      console.warn("AdMob init error:", err);
    });
}
