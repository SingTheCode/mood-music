import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * 토스 로그인 인증 Guard
 * x-user-id 헤더에서 유저 식별키를 추출하여 검증합니다.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new UnauthorizedException('x-user-id header is required');
    }

    // 유저 식별키를 request 객체에 저장하여 컨트롤러에서 접근 가능하게 함
    request.userId = userId;

    return true;
  }
}
