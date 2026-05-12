import { Injectable } from '@nestjs/common';

export interface DailyLimitData {
  date: string;
  count: number;
}

@Injectable()
export class DailyLimitService {
  private userLimits = new Map<string, DailyLimitData>();

  async getByUserId(userId: string, date: string): Promise<DailyLimitData> {
    const stored = this.userLimits.get(userId);
    if (stored && stored.date === date) {
      return stored;
    }
    return { date: date || this.getToday(), count: 0 };
  }

  async increment(userId: string): Promise<DailyLimitData> {
    const today = this.getToday();
    const current = await this.getByUserId(userId, today);
    const updated: DailyLimitData = { date: today, count: current.count + 1 };
    this.userLimits.set(userId, updated);
    return updated;
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
