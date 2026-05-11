/**
 * Frontend-specific keyword domain types
 */

/**
 * Represents the state of a single bubble in the floating UI
 */
export interface BubbleState {
  /** Unique identifier for the bubble */
  id: string;
  /** The keyword text */
  keyword: string;
  /** X coordinate in canvas space */
  x: number;
  /** Y coordinate in canvas space */
  y: number;
  /** Radius of the bubble */
  radius: number;
  /** Whether this bubble is currently selected */
  isSelected: boolean;
  /** Scale factor for visual representation (1.0 = normal, 1.2 = enlarged when selected) */
  scale: number;
}

/**
 * Represents the current state of keyword selection
 */
export interface KeywordSelectionState {
  /** Array of selected keyword strings, in selection order */
  selected: string[];
  /** Whether the "recommend" button should be enabled (true if 2-4 keywords selected) */
  canRecommend: boolean;
  /** Error message if selection is invalid */
  error: string | null;
}

/**
 * Canvas dimensions for bubble physics calculations
 */
export interface CanvasDimensions {
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
}

/**
 * Configuration for bubble physics simulation
 */
export interface BubblePhysicsConfig {
  /** Minimum distance between bubble centers to avoid overlap */
  minDistance: number;
  /** Padding from canvas edges */
  edgePadding: number;
  /** Radius of each bubble */
  bubbleRadius: number;
  /** Maximum attempts to find non-overlapping position */
  maxPositionAttempts: number;
}
