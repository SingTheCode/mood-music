export interface YoutubeVideo {
  /** YouTube 영상 ID */
  videoId: string;
  /** 영상 제목 */
  title: string;
  /** 썸네일 URL */
  thumbnail: string;
  /** 채널명 */
  channelTitle: string;
  /** 영상 길이 (초) */
  duration?: number;
}

export interface Playlist {
  /** 플레이리스트 고유 ID */
  id: string;
  /** 검색에 사용된 키워드 조합 */
  keywords: string[];
  /** 영상 목록 */
  videos: YoutubeVideo[];
}
