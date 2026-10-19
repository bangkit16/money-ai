import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

export async function initMobileAds(): Promise<void> {
  // 1. Google UMP Consent flow (GDPR / UK compliance)
  try {
    await AdsConsent.requestInfoUpdate();
    await AdsConsent.loadAndShowConsentFormIfRequired();
  } catch (err) {
    console.warn("AdsConsent UMP error:", err);
  }

  // 2. Initialize Mobile Ads SDK
  try {
    await mobileAds().initialize();
  } catch (err) {
    console.warn("AdMob init error:", err);
  }
}
