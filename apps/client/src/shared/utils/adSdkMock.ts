import { AdType } from '@mood-music/shared-types';

/**
 * 광고 로드 결과 인터페이스
 */
interface AdLoadResult {
  /** 광고 로드 성공 여부 */
  success: boolean;
  /** 로드된 광고 타입 */
  adType: AdType;
}

/**
 * 보상형 광고 결과 인터페이스
 */
interface RewardedAdResult {
  /** 보상 지급 여부 */
  rewarded: boolean;
}

/**
 * Mock 광고 SDK 클래스
 * 개발 환경에서 실제 AdMob 없이 광고 동작을 시뮬레이션한다.
 */
export class AdSdkMock {
  /**
   * 보상형 광고를 사전 로딩한다.
   * @returns 로딩 성공 여부
   */
  async loadRewardedAd(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  /**
   * 보상형 광고를 표시하고 보상 결과를 반환한다.
   * @returns 보상 지급 결과
   */
  async showRewardedAd(): Promise<RewardedAdResult> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { rewarded: true };
  }

  /**
   * 전면 광고를 사전 로딩한다.
   * @returns 로딩 성공 여부
   */
  async loadInterstitialAd(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  /**
   * 전면 광고를 표시한다.
   */
  async showInterstitialAd(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
  }
}

export type { AdLoadResult, RewardedAdResult };
export const adSdk = new AdSdkMock();
