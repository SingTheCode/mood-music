/**
 * 사용자 피드백 반응 타입
 */
export enum FeedbackReaction {
  /** 별로예요 */
  DISLIKE = 'DISLIKE',
  /** 괜찮아요 */
  NEUTRAL = 'NEUTRAL',
  /** 좋아요 */
  LIKE = 'LIKE',
}

/**
 * 피드백 엔트리 인터페이스
 */
export interface FeedbackEntry {
  /** 선택된 감정 키워드 목록 */
  keywords: string[];
  /** 재생된 곡 ID 목록 */
  trackIds: string[];
  /** 사용자 반응 */
  reaction: FeedbackReaction;
  /** 피드백 생성 타임스탬프 */
  createdAt: number;
}
