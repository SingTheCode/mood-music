import { useCallback, useEffect, useState } from 'react';
import { graniteEvent } from '@apps-in-toss/web-framework';

interface UseExitConfirmReturn {
  isOpen: boolean;
  confirm: () => void;
  cancel: () => void;
}

export function useExitConfirm(): UseExitConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const cleanup = graniteEvent.addEventListener('backEvent', {
      onEvent: () => {
        setIsOpen(true);
      },
    });

    return cleanup;
  }, []);

  const confirm = useCallback(() => {
    setIsOpen(false);
    window.close();
  }, []);

  const cancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, confirm, cancel };
}
