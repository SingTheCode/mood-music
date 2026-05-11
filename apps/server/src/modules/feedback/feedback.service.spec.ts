import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import type { FeedbackReaction } from '@mood-music/shared-types';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  describe('saveFeedback', () => {
    it('should save feedback entry', async () => {
      const result = await service.saveFeedback({
        keywords: ['잔잔한'],
        trackIds: ['video-123'],
        reaction: 'LIKE' as FeedbackReaction,
        createdAt: Date.now(),
      });

      expect(result).toBeDefined();
      expect(result.reaction).toBe('LIKE');
    });

    it('should reject invalid reaction', async () => {
      await expect(
        service.saveFeedback({
          keywords: ['잔잔한'],
          trackIds: ['video-123'],
          reaction: 'INVALID' as any,
          createdAt: Date.now(),
        }),
      ).rejects.toThrow();
    });
  });
});
