import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import type { HistoryEntry } from '@mood-music/shared-types';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryService],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  describe('saveEntry', () => {
    it('should save history entry', async () => {
      const entry: Omit<HistoryEntry, 'id'> = {
        keywords: ['잔잔한', '새벽'],
        playlistId: 'playlist-123',
        createdAt: new Date().toISOString(),
      };

      const result = await service.saveEntry('user-123', entry);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.keywords).toEqual(entry.keywords);
    });
  });

  describe('getByUserId', () => {
    it('should return user history entries', async () => {
      const entry: Omit<HistoryEntry, 'id'> = {
        keywords: ['잔잔한'],
        playlistId: 'playlist-123',
        createdAt: new Date().toISOString(),
      };

      await service.saveEntry('user-123', entry);
      const result = await service.getByUserId('user-123');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array for unknown user', async () => {
      const result = await service.getByUserId('unknown-user');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
