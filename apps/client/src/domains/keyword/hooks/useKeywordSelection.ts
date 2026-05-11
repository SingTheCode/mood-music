import { useState, useCallback } from 'react';
import { addKeywordSelection, removeKeywordSelection, canRecommend } from '../utils/keywordSelection';
import type { KeywordSelectionState } from '../types/entity';

/**
 * Hook for managing keyword selection state
 */
export function useKeywordSelection() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleKeyword = useCallback((keyword: string) => {
    setSelected(prev => {
      const index = prev.indexOf(keyword);
      if (index >= 0) {
        return removeKeywordSelection(prev, index);
      }
      return addKeywordSelection(prev, keyword);
    });
  }, []);

  const addKeyword = useCallback((keyword: string) => {
    setSelected(prev => addKeywordSelection(prev, keyword));
  }, []);

  const removeKeyword = useCallback((keyword: string) => {
    setSelected(prev => {
      const index = prev.indexOf(keyword);
      return index >= 0 ? removeKeywordSelection(prev, index) : prev;
    });
  }, []);

  const reset = useCallback(() => {
    setSelected([]);
  }, []);

  const state: KeywordSelectionState = {
    selected,
    canRecommend: canRecommend(selected),
    error: null,
  };

  return {
    state,
    toggleKeyword,
    addKeyword,
    removeKeyword,
    reset,
  };
}
