import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleAdMob } from '@apps-in-toss/web-framework';

const REWARDED_AD_GROUP_ID = import.meta.env.VITE_REWARDED_AD_GROUP_ID || '';
const INTERSTITIAL_AD_GROUP_ID = import.meta.env.VITE_INTERSTITIAL_AD_GROUP_ID || '';

interface UseAdReturn {
  isAdLoaded: boolean;
  loadRewardedAd: () => void;
  showRewardedAd: () => Promise<boolean>;
  showInterstitialAd: () => Promise<void>;
}

export function useAd(): UseAdReturn {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const loadRewardedAd = useCallback(() => {
    cleanupRef.current?.();

    cleanupRef.current = GoogleAdMob.loadAppsInTossAdMob({
      options: { adGroupId: REWARDED_AD_GROUP_ID },
      onEvent: event => {
        if (event.type === 'loaded') {
          setIsAdLoaded(true);
        }
      },
      onError: () => {
        setIsAdLoaded(false);
      },
    });
  }, []);

  const showRewardedAd = useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      setIsAdLoaded(false);

      GoogleAdMob.showAppsInTossAdMob({
        options: { adGroupId: REWARDED_AD_GROUP_ID },
        onEvent: event => {
          switch (event.type) {
            case 'userEarnedReward':
              resolve(true);
              break;
            case 'dismissed':
              resolve(false);
              loadRewardedAd();
              break;
          }
        },
        onError: () => {
          resolve(false);
          loadRewardedAd();
        },
      });
    });
  }, [loadRewardedAd]);

  const showInterstitialAd = useCallback((): Promise<void> => {
    return new Promise(resolve => {
      const cleanup = GoogleAdMob.loadAppsInTossAdMob({
        options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
        onEvent: event => {
          if (event.type === 'loaded') {
            cleanup();
            GoogleAdMob.showAppsInTossAdMob({
              options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
              onEvent: showEvent => {
                if (showEvent.type === 'dismissed') {
                  resolve();
                }
              },
              onError: () => {
                resolve();
              },
            });
          }
        },
        onError: () => {
          cleanup();
          resolve();
        },
      });
    });
  }, []);

  useEffect(() => {
    loadRewardedAd();
    return () => {
      cleanupRef.current?.();
    };
  }, [loadRewardedAd]);

  return {
    isAdLoaded,
    loadRewardedAd,
    showRewardedAd,
    showInterstitialAd,
  };
}
