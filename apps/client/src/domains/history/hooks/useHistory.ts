import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchHistory, saveHistoryEntry, deleteHistoryEntry } from '../apis/historyApi';
import { historyKeys } from '../constants/queryKeys';
import type { HistoryEntry, HistoryFilter } from '../types/entity';

/**
 * Hook for managing user history entries
 */
export function useHistory(filter?: HistoryFilter) {
  const queryClient = useQueryClient();

  const entries = useQuery({
    queryKey: historyKeys.list(filter?.limit, filter?.offset),
    queryFn: () => fetchHistory(filter),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  const saveEntryMutation = useMutation({
    mutationFn: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => saveHistoryEntry(entry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => deleteHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: historyKeys.lists() });
    },
  });

  return {
    entries,
    saveEntry: saveEntryMutation.mutate,
    deleteEntry: deleteEntryMutation.mutate,
    isSaving: saveEntryMutation.isPending,
    isDeleting: deleteEntryMutation.isPending,
  };
}
