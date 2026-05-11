import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

/**
 * 인증 모듈
 * 토스 로그인 기반 유저 식별 및 인증을 담당합니다.
 */
@Module({
  providers: [AuthGuard, AuthService],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
