import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, AuthService],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  describe('canActivate', () => {
    it('should allow request with valid user ID', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-user-id': 'valid-user-123',
            },
          }),
        }),
      } as ExecutionContext;

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when x-user-id header is missing', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when x-user-id is empty string', () => {
      const mockExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-user-id': '',
            },
          }),
        }),
      } as ExecutionContext;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(UnauthorizedException);
    });
  });
});
