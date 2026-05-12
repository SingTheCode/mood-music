import type { HistoryEntry, HistoryFilter } from '@/domains/history/types/entity';
import { getAuthHeaders } from '@/shared/utils/authHeaders';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function fetchHistory(filter?: HistoryFilter): Promise<HistoryEntry[]> {
  const params = new URLSearchParams();
  if (filter?.limit) {
    params.append('limit', String(filter.limit));
  }
  if (filter?.offset) {
    params.append('offset', String(filter.offset));
  }

  const response = await fetch(`${API_BASE_URL}/history?${params.toString()}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  return response.json();
}

export async function saveHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): Promise<HistoryEntry> {
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error(`Failed to save history entry: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete history entry: ${response.statusText}`);
  }
}
