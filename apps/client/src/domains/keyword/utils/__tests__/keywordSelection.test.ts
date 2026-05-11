import { describe, it, expect } from 'vitest';
import {
  addKeywordSelection,
  removeKeywordSelection,
  canRecommend,
  getSelectedKeywords,
} from '@/domains/keyword/utils/keywordSelection';

describe('keywordSelection', () => {
  describe('addKeywordSelection', () => {
    it('should add a keyword when under 4 selections', () => {
      const selected = ['잔잔한'];
      const result = addKeywordSelection(selected, '새벽');
      expect(result).toEqual(['잔잔한', '새벽']);
    });

    it('should remove oldest keyword when adding 5th keyword (FIFO)', () => {
      const selected = ['잔잔한', '새벽', '혼자', '비 오는'];
      const result = addKeywordSelection(selected, '신나는');
      expect(result).toEqual(['새벽', '혼자', '비 오는', '신나는']);
      expect(result.length).toBe(4);
    });

    it('should allow duplicate keywords from same or different categories', () => {
      const selected = ['잔잔한'];
      const result = addKeywordSelection(selected, '잔잔한');
      expect(result).toEqual(['잔잔한', '잔잔한']);
    });

    it('should not add if keyword is already at max (4) and no removal needed', () => {
      const selected = ['잔잔한', '새벽', '혼자', '비 오는'];
      const result = addKeywordSelection(selected, '신나는');
      expect(result.length).toBe(4);
    });
  });

  describe('removeKeywordSelection', () => {
    it('should remove keyword at specified index', () => {
      const selected = ['잔잔한', '새벽', '혼자'];
      const result = removeKeywordSelection(selected, 1);
      expect(result).toEqual(['잔잔한', '혼자']);
    });

    it('should handle removing first keyword', () => {
      const selected = ['잔잔한', '새벽'];
      const result = removeKeywordSelection(selected, 0);
      expect(result).toEqual(['새벽']);
    });

    it('should handle removing last keyword', () => {
      const selected = ['잔잔한', '새벽', '혼자'];
      const result = removeKeywordSelection(selected, 2);
      expect(result).toEqual(['잔잔한', '새벽']);
    });

    it('should return empty array when removing only keyword', () => {
      const selected = ['잔잔한'];
      const result = removeKeywordSelection(selected, 0);
      expect(result).toEqual([]);
    });
  });

  describe('canRecommend', () => {
    it('should return false when less than 2 keywords selected', () => {
      expect(canRecommend([])).toBe(false);
      expect(canRecommend(['잔잔한'])).toBe(false);
    });

    it('should return true when 2-4 keywords selected', () => {
      expect(canRecommend(['잔잔한', '새벽'])).toBe(true);
      expect(canRecommend(['잔잔한', '새벽', '혼자'])).toBe(true);
      expect(canRecommend(['잔잔한', '새벽', '혼자', '비 오는'])).toBe(true);
    });

    it('should return false when more than 4 keywords (should not happen but guard)', () => {
      expect(canRecommend(['잔잔한', '새벽', '혼자', '비 오는', '신나는'])).toBe(false);
    });
  });

  describe('getSelectedKeywords', () => {
    it('should return selected keywords in order', () => {
      const selected = ['잔잔한', '새벽', '혼자'];
      expect(getSelectedKeywords(selected)).toEqual(['잔잔한', '새벽', '혼자']);
    });

    it('should return empty array when no keywords selected', () => {
      expect(getSelectedKeywords([])).toEqual([]);
    });

    it('should preserve order including duplicates', () => {
      const selected = ['잔잔한', '새벽', '잔잔한'];
      expect(getSelectedKeywords(selected)).toEqual(['잔잔한', '새벽', '잔잔한']);
    });
  });
});
