import { useCallback } from "react";

export function useRewardedAd() {
  const showRewardedAd = useCallback((): Promise<boolean> => {
    return Promise.resolve(false);
  }, []);

  const reloadAd = useCallback(() => {}, []);

  return {
    isAdLoaded: false,
    isAdLoading: false,
    showRewardedAd,
    reloadAd,
  };
}
