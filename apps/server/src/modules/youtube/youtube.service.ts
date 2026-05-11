import { Injectable, Inject } from '@nestjs/common';
import type { YoutubeVideo } from '@mood-music/shared-types';

/**
 * YouTube 검색 결과 아이템 인터페이스
 */
interface YouTubeSearchItem {
  /** Video ID information */
  id: { videoId: string };
  /** Video snippet metadata */
  snippet: {
    /** Video title */
    title: string;
    /** Channel name */
    channelTitle: string;
    /** Thumbnail URLs */
    thumbnails?: {
      /** High resolution thumbnail */
      high?: { url: string };
      /** Default thumbnail */
      default?: { url: string };
    };
  };
}

/**
 * YouTube API 클라이언트 인터페이스
 */
interface YouTubeClient {
  /** Search API */
  search: {
    /**
     * Search for videos
     * @param params Search parameters
     * @returns Search results
     */
    list: (params: {
      /** API part (snippet, etc.) */
      part: string;
      /** Search query */
      q: string;
      /** Resource type (video, etc.) */
      type: string;
      /** Video category ID */
      videoCategoryId: string;
      /** Maximum results to return */
      maxResults: number;
      /** Sort order */
      order: string;
    }) => Promise<{ data: { items: YouTubeSearchItem[] } }>;
  };
}

/**
 * YouTube 검색 서비스
 * YouTube Data API v3를 통해 음악 영상을 검색합니다.
 */
@Injectable()
export class YouTubeService {
  private cache = new Map<string, { result: YoutubeVideo[]; timestamp: number }>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30분

  constructor(@Inject('YOUTUBE_CLIENT') private youtubeClient: YouTubeClient) {}

  /**
   * YouTube에서 음악 영상을 검색합니다.
   * @param query 검색 쿼리
   * @returns 검색 결과 영상 배열
   */
  async search(query: string): Promise<YoutubeVideo[]> {
    const cacheKey = query.toLowerCase();

    // 캐시 확인
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }

    try {
      const response = await this.youtubeClient.search.list({
        part: 'snippet',
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music category
        maxResults: 10,
        order: 'relevance',
      });

      const videos = this.parseSearchResults(response.data.items || []);
      this.cache.set(cacheKey, { result: videos, timestamp: Date.now() });
      return videos;
    } catch {
      return [];
    }
  }

  private parseSearchResults(items: YouTubeSearchItem[]): YoutubeVideo[] {
    return items
      .filter(item => item.id?.videoId)
      .map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      }));
  }
}
