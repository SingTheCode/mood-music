import { useCallback, useEffect, useState } from 'react';
import { getUserKey } from '@/shared/hooks/useUserKey';
import { useSubscription } from '@/shared/hooks/useSubscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const MAX_FREE_USES = 5;

interface DailyLimitState {
  count: number;
  date: string;
}

interface UseDailyLimitReturn {
  canUse: boolean;
  remaining: number;
  increment: () => Promise<void>;
  addRewardedUse: () => void;
  isPremium: boolean;
  isLoading: boolean;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useDailyLimit(): UseDailyLimitReturn {
  const { isPremium } = useSubscription();
  const [state, setState] = useState<DailyLimitState>({ count: 0, date: getToday() });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userKey = getUserKey();
    if (!userKey) {
      setIsLoading(false);
      return undefined;
    }

    fetch(`${API_BASE_URL}/daily-limit?date=${getToday()}`, {
      headers: { 'x-user-id': userKey },
    })
      .then(res => res.json())
      .then((data: DailyLimitState) => {
        setState(data);
      })
      .catch(() => {
        setState({ count: 0, date: getToday() });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const today = getToday();
  const count = state.date === today ? state.count : 0;
  const remaining = isPremium ? Infinity : Math.max(0, MAX_FREE_USES - count);
  const canUse = isPremium || remaining > 0;

  const increment = useCallback(async () => {
    const userKey = getUserKey();
    if (!userKey) {
      return;
    }

    const newCount = count + 1;
    setState({ count: newCount, date: getToday() });

    await fetch(`${API_BASE_URL}/daily-limit/increment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userKey,
      },
    }).catch(() => {});
  }, [count]);

  const addRewardedUse = useCallback(() => {
    setState(prev => ({
      ...prev,
      count: Math.max(0, prev.count - 1),
    }));
  }, []);

  return { canUse, remaining, increment, addRewardedUse, isPremium, isLoading };
}
