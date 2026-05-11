/**
 * Pure functions for keyword selection state management
 */

/**
 * Adds a keyword to the selection array. If already at 4 keywords,
 * removes the oldest (FIFO) before adding the new one.
 */
export function addKeywordSelection(selected: string[], keyword: string): string[] {
  if (selected.length >= 4) {
    return [...selected.slice(1), keyword];
  }
  return [...selected, keyword];
}

/**
 * Removes a keyword at the specified index
 */
export function removeKeywordSelection(selected: string[], index: number): string[] {
  return selected.filter((_, i) => i !== index);
}

/**
 * Determines if recommendation can be triggered (2-4 keywords selected)
 */
export function canRecommend(selected: string[]): boolean {
  return selected.length >= 2 && selected.length <= 4;
}

/**
 * Returns the current selection (identity function for clarity)
 */
export function getSelectedKeywords(selected: string[]): string[] {
  return selected;
}
