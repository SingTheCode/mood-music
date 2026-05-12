import { getAnonymousKey } from '@apps-in-toss/web-framework';
import { useEffect, useState } from 'react';

let cachedUserKey: string | null = null;

export function useUserKey() {
  const [userKey, setUserKey] = useState<string | null>(cachedUserKey);
  const [isLoading, setIsLoading] = useState(!cachedUserKey);

  useEffect(() => {
    if (cachedUserKey) {
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);

    getAnonymousKey()
      .then(result => {
        if (cancelled) {
          return;
        }
        if (result && result !== 'ERROR' && result.type === 'HASH') {
          cachedUserKey = result.hash;
          setUserKey(result.hash);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { userKey, isLoading };
}

export function getUserKey(): string | null {
  return cachedUserKey;
}
