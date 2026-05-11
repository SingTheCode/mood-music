import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHistory } from '../useHistory';
import * as historyApi from '../../apis/historyApi';
import type { HistoryEntry } from '../../types/entity';

vi.mock('../../apis/historyApi');

describe('useHistory', () => {
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

  const mockEntry: HistoryEntry = {
    id: 'entry-1',
    keywords: ['잔잔한', '새벽'],
    tracks: [{ videoId: 'abc123', title: 'Chill Music' }],
    createdAt: new Date().toISOString(),
  };

  it('should fetch history entries on mount', async () => {
    vi.mocked(historyApi.fetchHistory).mockResolvedValue([mockEntry]);

    const { result } = renderHook(() => useHistory(), { wrapper });

    await waitFor(() => {
      expect(result.current.entries.isLoading).toBe(false);
    });

    expect(result.current.entries.data).toEqual([mockEntry]);
    expect(historyApi.fetchHistory).toHaveBeenCalled();
  });

  it('should save a new history entry', async () => {
    vi.mocked(historyApi.saveHistoryEntry).mockResolvedValue(mockEntry);

    const { result } = renderHook(() => useHistory(), { wrapper });

    const newEntry = {
      keywords: ['잔잔한', '새벽'],
      tracks: [{ videoId: 'abc123', title: 'Chill Music' }],
    };

    await waitFor(() => {
      result.current.saveEntry(newEntry);
    });

    expect(historyApi.saveHistoryEntry).toHaveBeenCalledWith(newEntry);
  });

  it('should delete a history entry', async () => {
    vi.mocked(historyApi.deleteHistoryEntry).mockResolvedValue(undefined);

    const { result } = renderHook(() => useHistory(), { wrapper });

    await waitFor(() => {
      result.current.deleteEntry('entry-1');
    });

    expect(historyApi.deleteHistoryEntry).toHaveBeenCalledWith('entry-1');
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Fetch failed');
    vi.mocked(historyApi.fetchHistory).mockRejectedValue(error);

    const { result } = renderHook(() => useHistory(), { wrapper });

    await waitFor(() => {
      expect(result.current.entries.isLoading).toBe(false);
    });

    expect(result.current.entries.error).toBeDefined();
  });
});
