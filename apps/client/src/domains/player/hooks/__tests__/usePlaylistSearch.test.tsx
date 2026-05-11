import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlaylistSearch } from '../usePlaylistSearch';
import * as playlistApi from '../../apis/playlistApi';
import type { SearchResult } from '../../types/entity';

vi.mock('../../apis/playlistApi');

describe('usePlaylistSearch', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return initial loading state', () => {
    vi.mocked(playlistApi.searchPlaylist).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => usePlaylistSearch(['잔잔한']), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('should fetch playlist on mount with keywords', async () => {
    const mockResult: SearchResult = {
      tracks: [
        {
          videoId: 'abc123',
          title: 'Chill Music',
          thumbnail: 'https://example.com/thumb.jpg',
          duration: 180,
          channelName: 'Chill Channel',
        },
      ],
      totalResults: 1,
    };

    vi.mocked(playlistApi.searchPlaylist).mockResolvedValue(mockResult);

    const { result } = renderHook(() => usePlaylistSearch(['잔잔한']), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockResult);
    expect(playlistApi.searchPlaylist).toHaveBeenCalledWith({
      keywords: ['잔잔한'],
      maxResults: 20,
    });
  });

  it('should handle multiple keywords', async () => {
    const mockResult: SearchResult = {
      tracks: [],
      totalResults: 0,
    };

    vi.mocked(playlistApi.searchPlaylist).mockResolvedValue(mockResult);

    const { result } = renderHook(() => usePlaylistSearch(['잔잔한', '새벽', '혼자']), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(playlistApi.searchPlaylist).toHaveBeenCalled();
    const callArgs = vi.mocked(playlistApi.searchPlaylist).mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs?.keywords).toContain('잔잔한');
    expect(callArgs?.keywords).toContain('새벽');
    expect(callArgs?.keywords).toContain('혼자');
    expect(callArgs?.maxResults).toBe(20);
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    vi.mocked(playlistApi.searchPlaylist).mockRejectedValue(error);

    const { result } = renderHook(() => usePlaylistSearch(['잔잔한']), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should cache results for same keywords', async () => {
    const mockResult: SearchResult = {
      tracks: [],
      totalResults: 0,
    };

    vi.mocked(playlistApi.searchPlaylist).mockResolvedValue(mockResult);

    const { result: result1 } = renderHook(() => usePlaylistSearch(['잔잔한']), {
      wrapper,
    });

    await waitFor(() => {
      expect(result1.current.isLoading).toBe(false);
    });

    const { result: result2 } = renderHook(() => usePlaylistSearch(['잔잔한']), {
      wrapper,
    });

    expect(result2.current.data).toEqual(mockResult);
    expect(playlistApi.searchPlaylist).toHaveBeenCalledTimes(1);
  });

  it('should refetch when keywords change', async () => {
    const mockResult: SearchResult = {
      tracks: [],
      totalResults: 0,
    };

    vi.mocked(playlistApi.searchPlaylist).mockResolvedValue(mockResult);

    const { result, rerender } = renderHook(({ keywords }: { keywords: string[] }) => usePlaylistSearch(keywords), {
      wrapper,
      initialProps: { keywords: ['잔잔한'] },
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    rerender({ keywords: ['새벽'] });

    await waitFor(() => {
      expect(playlistApi.searchPlaylist).toHaveBeenCalledTimes(2);
    });

    const secondCallArgs = vi.mocked(playlistApi.searchPlaylist).mock.calls[1]?.[0];
    expect(secondCallArgs).toBeDefined();
    expect(secondCallArgs?.keywords).toContain('새벽');
    expect(secondCallArgs?.maxResults).toBe(20);
  });
});
