import { useState, useEffect, useCallback } from 'react';

import { adSdk } from '@/shared/utils/adSdkMock';

/**
 * 광고 관리 훅 반환 타입
 */
interface UseAdReturn {
  /** 보상형 광고 로드 완료 여부 */
  isAdLoaded: boolean;
  /** 보상형 광고 사전 로딩 */
  loadRewardedAd: () => Promise<void>;
  /** 보상형 광고 표시 → 보상 지급 여부 반환 */
  showRewardedAd: () => Promise<boolean>;
  /** 전면 광고 표시 */
  showInterstitialAd: () => Promise<void>;
}

export function useAd(): UseAdReturn {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  const loadRewardedAd = useCallback(async () => {
    const loaded = await adSdk.loadRewardedAd();
    setIsAdLoaded(loaded);
  }, []);

  const showRewardedAd = useCallback(async (): Promise<boolean> => {
    const result = await adSdk.showRewardedAd();
    setIsAdLoaded(false);
    loadRewardedAd();
    return result.rewarded;
  }, [loadRewardedAd]);

  const showInterstitialAd = useCallback(async (): Promise<void> => {
    await adSdk.loadInterstitialAd();
    await adSdk.showInterstitialAd();
  }, []);

  useEffect(() => {
    loadRewardedAd();
  }, [loadRewardedAd]);

  return {
    isAdLoaded,
    loadRewardedAd,
    showRewardedAd,
    showInterstitialAd,
  };
}
