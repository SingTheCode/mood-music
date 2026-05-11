/**
 * Represents a single track/video in a playlist
 */
export interface Track {
  /** YouTube video ID */
  videoId: string;
  /** Video title */
  title: string;
  /** Video thumbnail URL */
  thumbnail: string;
  /** Video duration in seconds */
  duration: number;
  /** Channel name */
  channelName: string;
}

/**
 * Represents a playlist of tracks
 */
export interface Playlist {
  /** Unique playlist identifier */
  id: string;
  /** Playlist title */
  title: string;
  /** Array of tracks in the playlist */
  tracks: Track[];
  /** Timestamp when playlist was created */
  createdAt: string;
}

/**
 * Search result from YouTube API
 */
export interface SearchResult {
  /** Array of tracks matching the search query */
  tracks: Track[];
  /** Total number of results available */
  totalResults: number;
}

/**
 * Parameters for playlist search
 */
export interface PlaylistSearchParams {
  /** Keywords to search for (comma-separated) */
  keywords: string[];
  /** Maximum number of results to return */
  maxResults?: number;
}
