import type { SearchResult, PlaylistSearchParams } from '../types/entity';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Searches for a playlist based on keywords
 */
export async function searchPlaylist(params: PlaylistSearchParams): Promise<SearchResult> {
  const queryString = new URLSearchParams({
    keywords: params.keywords.join(','),
    maxResults: String(params.maxResults || 20),
  }).toString();

  const response = await fetch(`${API_BASE_URL}/youtube/search?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': 'user-' + Math.random().toString(36).substr(2, 9),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search playlist: ${response.statusText}`);
  }

  return response.json();
}
