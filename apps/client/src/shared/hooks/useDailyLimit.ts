import { useCallback, useState } from 'react';

import { useSubscription } from '@/shared/hooks/useSubscription';

const DAILY_LIMIT_KEY = 'mood-music-daily-limit';
const MAX_FREE_USES = 5;

interface DailyLimitData {
  /** 저장된 날짜 (YYYY-MM-DD) */
  date: string;
  /** 해당 날짜의 사용 횟수 */
  count: number;
}

/** useDailyLimit 훅 반환 타입 */
interface UseDailyLimitReturn {
  /** 추천을 사용할 수 있는지 여부 */
  canUse: boolean;
  /** 남은 사용 횟수 (PREMIUM은 Infinity) */
  remaining: number;
  /** 사용 횟수 1 증가 */
  increment: () => void;
  /** 보상형 광고 완료 후 1회 추가 */
  addRewardedUse: () => void;
  /** 프리미엄 유저 여부 */
  isPremium: boolean;
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadFromStorage(): DailyLimitData {
  try {
    const stored = localStorage.getItem(DAILY_LIMIT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as DailyLimitData;
      if (parsed.date === getToday()) {
        return parsed;
      }
    }
  } catch {
    // 파싱 실패 시 초기값 반환
  }
  return { date: getToday(), count: 0 };
}

function saveToStorage(data: DailyLimitData): void {
  localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify(data));
}

/**
 * 일일 사용 제한 관리 훅
 * FREE 유저는 일 5회 제한, PREMIUM 유저는 무제한
 */
export function useDailyLimit(): UseDailyLimitReturn {
  const { isPremium } = useSubscription();
  const [data, setData] = useState<DailyLimitData>(loadFromStorage);

  const today = getToday();
  const isToday = data.date === today;
  const count = isToday ? data.count : 0;
  const remaining = isPremium ? Infinity : Math.max(0, MAX_FREE_USES - count);
  const canUse = isPremium || remaining > 0;

  const increment = useCallback(() => {
    setData(prev => {
      const currentToday = getToday();
      const currentCount = prev.date === currentToday ? prev.count : 0;
      const next: DailyLimitData = { date: currentToday, count: currentCount + 1 };
      saveToStorage(next);
      return next;
    });
  }, []);

  const addRewardedUse = useCallback(() => {
    setData(prev => {
      const currentToday = getToday();
      const currentCount = prev.date === currentToday ? prev.count : 0;
      const next: DailyLimitData = { date: currentToday, count: Math.max(0, currentCount - 1) };
      saveToStorage(next);
      return next;
    });
  }, []);

  return { canUse, remaining, increment, addRewardedUse, isPremium };
}
