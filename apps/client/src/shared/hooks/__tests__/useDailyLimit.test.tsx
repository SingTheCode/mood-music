import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDailyLimit } from '../useDailyLimit';

const DAILY_LIMIT_KEY = 'mood-music-daily-limit';

vi.mock('../useSubscription', () => ({
  useSubscription: vi.fn(() => ({
    tier: 'FREE',
    isPremium: false,
    isSubscribing: false,
    subscribe: vi.fn(),
  })),
}));

import { useSubscription } from '../useSubscription';

const mockUseSubscription = vi.mocked(useSubscription);

function mockPremiumUser() {
  mockUseSubscription.mockReturnValue({
    tier: 'PREMIUM' as never,
    isPremium: true,
    isSubscribing: false,
    subscribe: vi.fn(),
  });
}

function mockFreeUser() {
  mockUseSubscription.mockReturnValue({
    tier: 'FREE' as never,
    isPremium: false,
    isSubscribing: false,
    subscribe: vi.fn(),
  });
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

describe('useDailyLimit', () => {
  beforeEach(() => {
    localStorage.clear();
    mockFreeUser();
  });

  describe('FREE 유저', () => {
    it('초기 상태에서 canUse=true, remaining=5', () => {
      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(5);
      expect(result.current.isPremium).toBe(false);
    });

    it('5회 미만 사용 시 canUse=true', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: getToday(), count: 3 }));

      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(2);
    });

    it('5회 도달 시 canUse=false', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: getToday(), count: 5 }));

      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(false);
      expect(result.current.remaining).toBe(0);
    });

    it('increment 호출 시 count 증가', () => {
      const { result } = renderHook(() => useDailyLimit());

      act(() => {
        result.current.increment();
      });

      expect(result.current.remaining).toBe(4);

      act(() => {
        result.current.increment();
      });

      expect(result.current.remaining).toBe(3);
    });

    it('5회 사용 후 increment 호출해도 canUse=false 유지', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: getToday(), count: 4 }));

      const { result } = renderHook(() => useDailyLimit());

      act(() => {
        result.current.increment();
      });

      expect(result.current.canUse).toBe(false);
      expect(result.current.remaining).toBe(0);
    });

    it('addRewardedUse 호출 후 canUse=true (1회 추가)', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: getToday(), count: 5 }));

      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(false);

      act(() => {
        result.current.addRewardedUse();
      });

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(1);
    });

    it('날짜 변경 시 카운트 리셋', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: '2020-01-01', count: 5 }));

      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(5);
    });

    it('increment 시 localStorage에 저장', () => {
      const { result } = renderHook(() => useDailyLimit());

      act(() => {
        result.current.increment();
      });

      const stored = JSON.parse(localStorage.getItem(DAILY_LIMIT_KEY)!);
      expect(stored.date).toBe(getToday());
      expect(stored.count).toBe(1);
    });
  });

  describe('PREMIUM 유저', () => {
    beforeEach(() => {
      mockPremiumUser();
    });

    it('항상 canUse=true', () => {
      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(true);
      expect(result.current.isPremium).toBe(true);
    });

    it('remaining=Infinity', () => {
      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.remaining).toBe(Infinity);
    });

    it('5회 이상 사용해도 canUse=true', () => {
      localStorage.setItem(DAILY_LIMIT_KEY, JSON.stringify({ date: getToday(), count: 100 }));

      const { result } = renderHook(() => useDailyLimit());

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(Infinity);
    });
  });
});
