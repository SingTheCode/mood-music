import { useCallback, useEffect, useState } from 'react';
import { IAP } from '@apps-in-toss/web-framework';
import { SubscriptionTier } from '@mood-music/shared-types';

const PREMIUM_PRODUCT_ID = 'mood-music-premium-monthly';

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  isPremium: boolean;
  isSubscribing: boolean;
  subscribe: () => Promise<void>;
  restore: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [tier, setTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const restore = useCallback((): Promise<void> => {
    return IAP.getCompletedOrRefundedOrders()
      .then(result => {
        const hasActivePremium = result.orders.some(
          order => order.sku === PREMIUM_PRODUCT_ID && order.status === 'COMPLETED',
        );
        setTier(hasActivePremium ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE);
      })
      .catch(() => {});
  }, []);

  const subscribe = useCallback(async () => {
    setIsSubscribing(true);
    return new Promise<void>(resolve => {
      IAP.createSubscriptionPurchaseOrder({
        options: {
          sku: PREMIUM_PRODUCT_ID,
          offerId: null,
          processProductGrant: async () => true,
        },
        onEvent: event => {
          if (event.type === 'success') {
            setTier(SubscriptionTier.PREMIUM);
          }
          setIsSubscribing(false);
          resolve();
        },
        onError: () => {
          setIsSubscribing(false);
          resolve();
        },
      });
    });
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  return {
    tier,
    isPremium: tier === SubscriptionTier.PREMIUM,
    isSubscribing,
    subscribe,
    restore,
  };
}
