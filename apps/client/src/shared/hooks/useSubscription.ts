import { useCallback, useState } from 'react';

import { SubscriptionTier } from '@mood-music/shared-types';

import { paymentSdk } from '@/shared/utils/paymentSdkMock';

const STORAGE_KEY = 'mood-music-subscription';
const PREMIUM_PRODUCT_ID = 'mood-music-premium-monthly';

/** useSubscription 훅 반환 타입 */
interface UseSubscriptionReturn {
  /** 현재 구독 티어 */
  tier: SubscriptionTier;
  /** 프리미엄 구독 여부 */
  isPremium: boolean;
  /** 결제 진행 중 여부 */
  isSubscribing: boolean;
  /** 프리미엄 구독 결제 실행 */
  subscribe: () => Promise<void>;
}

function getStoredTier(): SubscriptionTier {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === SubscriptionTier.PREMIUM) {
    return SubscriptionTier.PREMIUM;
  }
  return SubscriptionTier.FREE;
}

/**
 * 구독 상태 관리 훅
 * localStorage 기반으로 구독 티어를 관리하고 결제 SDK를 호출한다
 */
export function useSubscription(): UseSubscriptionReturn {
  const [tier, setTier] = useState<SubscriptionTier>(getStoredTier);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const subscribe = useCallback(async () => {
    setIsSubscribing(true);
    try {
      const result = await paymentSdk.purchase(PREMIUM_PRODUCT_ID);
      if (result.success) {
        localStorage.setItem(STORAGE_KEY, SubscriptionTier.PREMIUM);
        setTier(SubscriptionTier.PREMIUM);
      }
    } finally {
      setIsSubscribing(false);
    }
  }, []);

  return {
    tier,
    isPremium: tier === SubscriptionTier.PREMIUM,
    isSubscribing,
    subscribe,
  };
}
