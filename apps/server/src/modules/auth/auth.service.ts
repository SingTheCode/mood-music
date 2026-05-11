import { Injectable } from '@nestjs/common';

/**
 * 토스 로그인 인증 서비스
 * 유저 식별키 검증 로직을 담당합니다.
 */
@Injectable()
export class AuthService {
  /**
   * 유저 식별키 유효성 검증
   * @param userId 유저 식별키
   * @returns 유효 여부
   */
  validateUserId(userId: string): boolean {
    // MVP: 단순히 존재 여부만 확인
    // 실제 앱인토스 SDK 검증은 인터페이스로 추상화하여 Mock 가능하게 함
    return !!(userId && typeof userId === 'string' && userId.trim().length > 0);
  }
}
