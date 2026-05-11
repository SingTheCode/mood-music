import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import type { FeedbackEntry, FeedbackReaction } from '@mood-music/shared-types';

/**
 * 피드백 서비스
 * 사용자의 음악 추천 피드백을 저장합니다.
 */
@Injectable()
export class FeedbackService {
  private feedbacks: FeedbackEntry[] = [];
  private readonly VALID_REACTIONS = ['DISLIKE', 'NEUTRAL', 'LIKE'];

  /**
   * 피드백을 저장합니다.
   * @param userId 사용자 ID
   * @param feedback 피드백 데이터
   * @returns 저장된 피드백
   */
  async saveFeedback(
    userId: string,
    feedback: Omit<FeedbackEntry, 'id' | 'createdAt'>,
  ): Promise<FeedbackEntry> {
    if (!this.VALID_REACTIONS.includes(feedback.reaction)) {
      throw new BadRequestException(`Invalid reaction: ${feedback.reaction}`);
    }

    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      ...feedback,
      createdAt: Date.now(),
    };

    this.feedbacks.push(entry);
    return entry;
  }
}
