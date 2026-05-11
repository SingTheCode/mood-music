/**
 * 구독 티어 타입
 */
export enum SubscriptionTier {
  /** 무료 사용자 */
  FREE = 'FREE',
  /** 프리미엄 구독자 */
  PREMIUM = 'PREMIUM',
}

/**
 * 구독 상태 타입
 */
export enum SubscriptionStatus {
  /** 활성 구독 */
  ACTIVE = 'ACTIVE',
  /** 구독 취소됨 */
  CANCELLED = 'CANCELLED',
  /** 구독 만료됨 */
  EXPIRED = 'EXPIRED',
}

/**
 * 구독 정보 인터페이스
 */
export interface SubscriptionInfo {
  /** 구독 티어 */
  tier: SubscriptionTier;
  /** 구독 상태 */
  status: SubscriptionStatus;
  /** 구독 시작 타임스탬프 */
  startedAt: number;
  /** 구독 만료 타임스탬프 (null이면 무기한) */
  expiresAt: number | null;
}
