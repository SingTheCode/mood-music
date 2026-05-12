import type { SearchResult, PlaylistSearchParams } from '@/domains/player/types/entity';
import { getAuthHeaders } from '@/shared/utils/authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function searchPlaylist(params: PlaylistSearchParams): Promise<SearchResult> {
  const queryString = new URLSearchParams({
    keywords: params.keywords.join(','),
    maxResults: String(params.maxResults || 20),
  }).toString();

  const response = await fetch(`${API_BASE_URL}/youtube/search?${queryString}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to search playlist: ${response.statusText}`);
  }

  return response.json();
}
