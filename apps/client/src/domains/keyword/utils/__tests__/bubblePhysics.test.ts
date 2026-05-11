import { describe, it, expect } from 'vitest';
import { generateInitialBubblePositions, detectBoundaryCollision, calculateBubbleScale } from '../bubblePhysics';
import type { CanvasDimensions, BubblePhysicsConfig } from '../../types/entity';

describe('bubblePhysics', () => {
  const defaultConfig: BubblePhysicsConfig = {
    minDistance: 100,
    edgePadding: 20,
    bubbleRadius: 30,
    maxPositionAttempts: 50,
  };

  const canvasDimensions: CanvasDimensions = {
    width: 400,
    height: 600,
  };

  describe('generateInitialBubblePositions', () => {
    it('should generate positions for all keywords without overlap', () => {
      const keywords = ['잔잔한', '새벽', '혼자', '비 오는'];
      const positions = generateInitialBubblePositions(keywords, canvasDimensions, defaultConfig);

      expect(positions).toHaveLength(4);
      positions.forEach(pos => {
        expect(pos).toHaveProperty('x');
        expect(pos).toHaveProperty('y');
        expect(typeof pos.x).toBe('number');
        expect(typeof pos.y).toBe('number');
      });
    });

    it('should respect canvas boundaries with padding', () => {
      const keywords = ['잔잔한', '새벽'];
      const positions = generateInitialBubblePositions(keywords, canvasDimensions, defaultConfig);

      positions.forEach(pos => {
        const minX = defaultConfig.edgePadding + defaultConfig.bubbleRadius;
        const maxX = canvasDimensions.width - defaultConfig.edgePadding - defaultConfig.bubbleRadius;
        const minY = defaultConfig.edgePadding + defaultConfig.bubbleRadius;
        const maxY = canvasDimensions.height - defaultConfig.edgePadding - defaultConfig.bubbleRadius;

        expect(pos.x).toBeGreaterThanOrEqual(minX);
        expect(pos.x).toBeLessThanOrEqual(maxX);
        expect(pos.y).toBeGreaterThanOrEqual(minY);
        expect(pos.y).toBeLessThanOrEqual(maxY);
      });
    });

    it('should maintain minimum distance between bubbles', () => {
      const keywords = ['잔잔한', '새벽', '혼자'];
      const positions = generateInitialBubblePositions(keywords, canvasDimensions, defaultConfig);

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const posI = positions[i];
          const posJ = positions[j];
          if (!posI || !posJ) continue;

          const dx = posI.x - posJ.x;
          const dy = posI.y - posJ.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          expect(distance).toBeGreaterThanOrEqual(defaultConfig.minDistance);
        }
      }
    });

    it('should handle single keyword', () => {
      const keywords = ['잔잔한'];
      const positions = generateInitialBubblePositions(keywords, canvasDimensions, defaultConfig);

      expect(positions).toHaveLength(1);
      expect(positions[0]).toHaveProperty('x');
      expect(positions[0]).toHaveProperty('y');
    });
  });

  describe('detectBoundaryCollision', () => {
    it('should detect collision when bubble exceeds left boundary', () => {
      const collision = detectBoundaryCollision(
        { x: 10, y: 300 },
        defaultConfig.bubbleRadius,
        canvasDimensions,
        defaultConfig,
      );

      expect(collision).toBe(true);
    });

    it('should detect collision when bubble exceeds right boundary', () => {
      const collision = detectBoundaryCollision(
        { x: 390, y: 300 },
        defaultConfig.bubbleRadius,
        canvasDimensions,
        defaultConfig,
      );

      expect(collision).toBe(true);
    });

    it('should detect collision when bubble exceeds top boundary', () => {
      const collision = detectBoundaryCollision(
        { x: 200, y: 10 },
        defaultConfig.bubbleRadius,
        canvasDimensions,
        defaultConfig,
      );

      expect(collision).toBe(true);
    });

    it('should detect collision when bubble exceeds bottom boundary', () => {
      const collision = detectBoundaryCollision(
        { x: 200, y: 590 },
        defaultConfig.bubbleRadius,
        canvasDimensions,
        defaultConfig,
      );

      expect(collision).toBe(true);
    });

    it('should not detect collision when bubble is within bounds', () => {
      const collision = detectBoundaryCollision(
        { x: 200, y: 300 },
        defaultConfig.bubbleRadius,
        canvasDimensions,
        defaultConfig,
      );

      expect(collision).toBe(false);
    });
  });

  describe('calculateBubbleScale', () => {
    it('should return 1.0 for unselected bubble', () => {
      const scale = calculateBubbleScale(false);
      expect(scale).toBe(1.0);
    });

    it('should return 1.2 for selected bubble', () => {
      const scale = calculateBubbleScale(true);
      expect(scale).toBe(1.2);
    });

    it('should be consistent for same selection state', () => {
      const scale1 = calculateBubbleScale(true);
      const scale2 = calculateBubbleScale(true);
      expect(scale1).toBe(scale2);
    });
  });
});
