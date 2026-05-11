import { useState } from 'react';

/** Storage key for AI disclosure acknowledgment */
const AI_DISCLOSURE_KEY = 'mood-music-ai-disclosed';

/**
 * Hook for managing AI disclosure state
 * Tracks whether user has acknowledged AI usage on first visit
 */
export function useAiDisclosure() {
  const [isDisclosed, setIsDisclosed] = useState(() => localStorage.getItem(AI_DISCLOSURE_KEY) === 'true');

  /**
   * Mark AI disclosure as confirmed and persist to localStorage
   */
  const confirm = () => {
    localStorage.setItem(AI_DISCLOSURE_KEY, 'true');
    setIsDisclosed(true);
  };

  return { isDisclosed, confirm };
}
