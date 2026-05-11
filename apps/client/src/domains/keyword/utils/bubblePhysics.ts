/**
 * Pure functions for bubble physics calculations
 */

import type { CanvasDimensions, BubblePhysicsConfig } from '@/domains/keyword/types/entity';

interface Position {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Generates initial non-overlapping positions for bubbles within canvas bounds
 */
export function generateInitialBubblePositions(
  keywords: string[],
  canvas: CanvasDimensions,
  config: BubblePhysicsConfig,
): Position[] {
  const positions: Position[] = [];
  const minX = config.edgePadding + config.bubbleRadius;
  const maxX = canvas.width - config.edgePadding - config.bubbleRadius;
  const minY = config.edgePadding + config.bubbleRadius;
  const maxY = canvas.height - config.edgePadding - config.bubbleRadius;

  for (let i = 0; i < keywords.length; i++) {
    let position: Position | null = null;
    let attempts = 0;

    while (!position && attempts < config.maxPositionAttempts) {
      const posX = minX + Math.random() * (maxX - minX);
      const posY = minY + Math.random() * (maxY - minY);
      const candidate = { x: posX, y: posY };

      const hasOverlap = positions.some(existing => {
        const dx = existing.x - candidate.x;
        const dy = existing.y - candidate.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < config.minDistance;
      });

      if (!hasOverlap) {
        position = candidate;
      }

      attempts++;
    }

    if (position) {
      positions.push(position);
    }
  }

  return positions;
}

/**
 * Detects if a bubble collides with canvas boundaries
 */
export function detectBoundaryCollision(
  position: Position,
  radius: number,
  canvas: CanvasDimensions,
  config: BubblePhysicsConfig,
): boolean {
  const minX = config.edgePadding + radius;
  const maxX = canvas.width - config.edgePadding - radius;
  const minY = config.edgePadding + radius;
  const maxY = canvas.height - config.edgePadding - radius;

  return position.x < minX || position.x > maxX || position.y < minY || position.y > maxY;
}

/**
 * Calculates visual scale factor for a bubble based on selection state
 */
export function calculateBubbleScale(isSelected: boolean): number {
  return isSelected ? 1.2 : 1.0;
}
