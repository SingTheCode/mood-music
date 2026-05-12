import { useEffect, useRef } from 'react';

interface UseAudioControlOptions {
  onPause: () => void;
  onResume: () => void;
}

export function useAudioControl({ onPause, onResume }: UseAudioControlOptions) {
  const isPausedBySystemRef = useRef(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPausedBySystemRef.current = true;
        onPause();
      } else if (isPausedBySystemRef.current) {
        isPausedBySystemRef.current = false;
        onResume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onPause, onResume]);
}
