import mobileAds, { AdsConsent } from "react-native-google-mobile-ads";

let initPromise: Promise<void> | null = null;
let isReady = false;

export async function initMobileAds(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. Google UMP Consent flow (GDPR / UK compliance)
    try {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      if (consentInfo.isConsentFormAvailable && consentInfo.status === "REQUIRED") {
        await AdsConsent.loadAndShowConsentFormIfRequired();
      }
    } catch (err) {
      console.warn("[AdMob] AdsConsent UMP warning:", err);
    }

    // 2. Initialize Mobile Ads SDK
    try {
      await mobileAds().initialize();
      isReady = true;
    } catch (err) {
      console.warn("[AdMob] Init error:", err);
    }
  })();

  return initPromise;
}

export function isMobileAdsReady(): boolean {
  return isReady;
}

