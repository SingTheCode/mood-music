import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDailyLimit } from '@/shared/hooks/useDailyLimit';

vi.mock('@/shared/hooks/useSubscription', () => ({
  useSubscription: vi.fn(() => ({
    tier: 'FREE',
    isPremium: false,
    isSubscribing: false,
    subscribe: vi.fn(),
    restore: vi.fn(),
  })),
}));

vi.mock('@/shared/hooks/useUserKey', () => ({
  getUserKey: vi.fn(() => 'test-user-key'),
}));

import { useSubscription } from '@/shared/hooks/useSubscription';

const mockUseSubscription = vi.mocked(useSubscription);

function mockPremiumUser() {
  mockUseSubscription.mockReturnValue({
    tier: 'PREMIUM' as never,
    isPremium: true,
    isSubscribing: false,
    subscribe: vi.fn(),
    restore: vi.fn(),
  });
}

function mockFreeUser() {
  mockUseSubscription.mockReturnValue({
    tier: 'FREE' as never,
    isPremium: false,
    isSubscribing: false,
    subscribe: vi.fn(),
    restore: vi.fn(),
  });
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

describe('useDailyLimit', () => {
  beforeEach(() => {
    mockFreeUser();
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ count: 0, date: getToday() }), { status: 200 }),
    );
  });

  describe('FREE 유저', () => {
    it('초기 상태에서 canUse=true, remaining=5', async () => {
      const { result } = renderHook(() => useDailyLimit());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(5);
      expect(result.current.isPremium).toBe(false);
    });

    it('서버에서 3회 사용 응답 시 remaining=2', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ count: 3, date: getToday() }), { status: 200 }),
      );

      const { result } = renderHook(() => useDailyLimit());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(2);
    });

    it('서버에서 5회 사용 응답 시 canUse=false', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ count: 5, date: getToday() }), { status: 200 }),
      );

      const { result } = renderHook(() => useDailyLimit());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canUse).toBe(false);
      expect(result.current.remaining).toBe(0);
    });

    it('addRewardedUse 호출 후 count 감소', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ count: 5, date: getToday() }), { status: 200 }),
      );

      const { result } = renderHook(() => useDailyLimit());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canUse).toBe(false);

      act(() => {
        result.current.addRewardedUse();
      });

      expect(result.current.canUse).toBe(true);
      expect(result.current.remaining).toBe(1);
    });
  });

  describe('PREMIUM 유저', () => {
    beforeEach(() => {
      mockPremiumUser();
    });

    it('항상 canUse=true, remaining=Infinity', async () => {
      const { result } = renderHook(() => useDailyLimit());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.canUse).toBe(true);
      expect(result.current.isPremium).toBe(true);
      expect(result.current.remaining).toBe(Infinity);
    });
  });
});
