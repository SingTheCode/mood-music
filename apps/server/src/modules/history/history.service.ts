import { Injectable } from '@nestjs/common';

export interface HistoryEntry {
  id: string;
  keywords: string[];
  playlistId: string;
  createdAt: Date;
}

@Injectable()
export class HistoryService {
  private entries: HistoryEntry[] = [];

  findAll(): HistoryEntry[] {
    return this.entries;
  }

  create(keywords: string[], playlistId: string): HistoryEntry {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      keywords,
      playlistId,
      createdAt: new Date(),
    };
    this.entries.push(entry);
    return entry;
  }
}
