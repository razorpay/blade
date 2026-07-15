import { useEffect } from 'react';

type FocusWithinHandlers = {
  onFocusWithin?: () => void;
  onBlurWithin?: () => void;
};

export const useFocusWithin = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  { onFocusWithin, onBlurWithin }: FocusWithinHandlers,
): void => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocusIn = (): void => {
      onFocusWithin?.();
    };

    const handleFocusOut = (event: FocusEvent): void => {
      // Ensure that focus is not still within the container
      if (element && !element.contains(event.relatedTarget as Node)) {
        onBlurWithin?.();
      }
    };

    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
    };
  }, [ref, onFocusWithin, onBlurWithin]);
};
