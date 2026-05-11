/**
 * Represents a single history entry of keyword selection and playlist
 */
export interface HistoryEntry {
  /** Unique identifier for the history entry */
  id: string;
  /** Keywords that were selected */
  keywords: string[];
  /** Tracks that were recommended */
  tracks: Array<{
    /** YouTube video ID */
    videoId: string;
    /** Video title */
    title: string;
  }>;
  /** Timestamp when this entry was created */
  createdAt: string;
  /** Optional user feedback on the recommendation */
  feedback?: 'LOVE' | 'LIKE' | 'NEUTRAL' | 'DISLIKE';
}

/**
 * Parameters for filtering history entries
 */
export interface HistoryFilter {
  /** Maximum number of entries to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Filter by date range (ISO string) */
  fromDate?: string;
  /** Filter by date range (ISO string) */
  toDate?: string;
}
