import { Injectable } from '@nestjs/common';
import type { HistoryEntry } from '@mood-music/shared-types';

/**
 * 히스토리 서비스
 * 사용자의 감정 키워드 선택 히스토리를 관리합니다.
 */
@Injectable()
export class HistoryService {
  private userHistory = new Map<string, HistoryEntry[]>();
  private readonly MAX_ENTRIES_PER_USER = 20;

  /**
   * 히스토리 엔트리를 저장합니다.
   * @param userId 사용자 ID
   * @param entry 히스토리 엔트리
   * @returns 저장된 엔트리
   */
  async saveEntry(userId: string, entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry> {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      ...entry,
    };

    if (!this.userHistory.has(userId)) {
      this.userHistory.set(userId, []);
    }

    const entries = this.userHistory.get(userId)!;
    entries.unshift(newEntry);

    // 최근 20개만 유지
    if (entries.length > this.MAX_ENTRIES_PER_USER) {
      entries.pop();
    }

    return newEntry;
  }

  /**
   * 사용자의 히스토리를 조회합니다.
   * @param userId 사용자 ID
   * @returns 히스토리 엔트리 배열
   */
  async getByUserId(userId: string): Promise<HistoryEntry[]> {
    return this.userHistory.get(userId) || [];
  }
}
