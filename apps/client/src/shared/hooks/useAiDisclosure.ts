import { useEffect, useState } from 'react';
import { Storage } from '@apps-in-toss/web-framework';

const AI_DISCLOSURE_KEY = 'mood-music-ai-disclosed';

export function useAiDisclosure() {
  const [isDisclosed, setIsDisclosed] = useState<boolean | null>(null);

  useEffect(() => {
    Storage.getItem(AI_DISCLOSURE_KEY).then(value => {
      setIsDisclosed(value === 'true');
    });
  }, []);

  const confirm = async () => {
    await Storage.setItem(AI_DISCLOSURE_KEY, 'true');
    setIsDisclosed(true);
  };

  return { isDisclosed: isDisclosed ?? false, isLoading: isDisclosed === null, confirm };
}
