import { useQuery } from '@tanstack/react-query';
import { searchPlaylist } from '@/domains/player/apis/playlistApi';
import { playerKeys } from '@/domains/player/constants/queryKeys';
import type { SearchResult } from '@/domains/player/types/entity';

/**
 * Hook for searching and fetching playlists based on keywords
 */
export function usePlaylistSearch(keywords: string[]) {
  return useQuery<SearchResult>({
    queryKey: playerKeys.search(keywords),
    queryFn: () =>
      searchPlaylist({
        keywords,
        maxResults: 20,
      }),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
