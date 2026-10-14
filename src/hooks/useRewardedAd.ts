import { useEffect, useRef } from "react";
import {
  useRewardedAd as useGoogleRewardedAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { claimRewardedAiBonus } from "@/lib/ai";
import { useToast } from "@/components/ui/toast";

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-3230523634633671/9001161038";

export function useRewardedAd() {
  const toast = useToast();
  const rewardedAd = useGoogleRewardedAd({
    adUnitId: AD_UNIT_ID,
    requestOptions: {
      requestNonPersonalizedAdsOnly: true,
    },
  });

  const claimedRef = useRef(false);

  useEffect(() => {
    if (rewardedAd.earnedReward && !claimedRef.current) {
      claimedRef.current = true;
      claimRewardedAiBonus(3).then((success) => {
        if (success) {
          toast.success("Bonus +3 kuota AI harian berhasil ditambahkan!");
        }
      });
    }
  }, [rewardedAd.earnedReward, toast]);

  useEffect(() => {
    if (rewardedAd.status === "closed") {
      claimedRef.current = false;
      rewardedAd.load();
    }
  }, [rewardedAd.status, rewardedAd]);

  const showRewardedAd = async (): Promise<boolean> => {
    if (rewardedAd.status !== "loaded") {
      toast.error("Iklan belum siap. Silakan coba sesaat lagi.");
      rewardedAd.load();
      return false;
    }

    claimedRef.current = false;
    rewardedAd.show();
    return true;
  };

  return {
    isAdLoaded: rewardedAd.status === "loaded",
    isAdLoading: rewardedAd.status === "loading",
    showRewardedAd,
    reloadAd: rewardedAd.load,
  };
}
