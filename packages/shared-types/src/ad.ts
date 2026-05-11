/**
 * 광고 타입
 */
export enum AdType {
  /** 보상형 광고 (시청 후 보상 제공) */
  REWARDED = 'REWARDED',
  /** 전면 광고 */
  INTERSTITIAL = 'INTERSTITIAL',
  /** 배너 광고 */
  BANNER = 'BANNER',
}

/**
 * 광고 보상 결과 인터페이스
 */
export interface AdRewardResult {
  /** 광고 타입 */
  adType: AdType;
  /** 보상 내용 (예: "추천 1회 추가") */
  reward: string;
  /** 보상 지급 타임스탬프 */
  grantedAt: number;
}
