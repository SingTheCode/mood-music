/** 결제 결과 인터페이스 */
interface PurchaseResult {
  /** 결제 성공 여부 */
  success: boolean;
  /** 거래 고유 ID */
  transactionId: string;
}

/**
 * 앱인토스 인앱결제 SDK Mock 클래스
 * 실제 SDK 연동 전까지 결제 플로우를 시뮬레이션한다
 */
export class PaymentSdkMock {
  /**
   * 상품 결제를 시뮬레이션한다
   * @param productId 결제할 상품 ID
   * @returns 결제 결과 (항상 성공)
   */
  async purchase(productId: string): Promise<PurchaseResult> {
    void productId;
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, transactionId: `mock-txn-${Date.now()}` };
  }

  /**
   * 이전 구매 내역을 복원한다
   * @returns 복원된 상품 ID 목록
   */
  async restorePurchases(): Promise<string[]> {
    return [];
  }
}

export const paymentSdk = new PaymentSdkMock();
