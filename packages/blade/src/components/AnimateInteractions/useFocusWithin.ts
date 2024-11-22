import { useEffect } from 'react';

type FocusWithinHandlers = {
  onFocusWithin?: () => void;
  onBlurWithin?: () => void;
};

export function useFocusWithin<T extends HTMLElement>(
  ref: React.RefObject<T>,
  { onFocusWithin, onBlurWithin }: FocusWithinHandlers,
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocusIn = () => {
      if (onFocusWithin) onFocusWithin();
    };

    const handleFocusOut = (event: FocusEvent) => {
      // Ensure that focus is not still within the container
      if (element && !element.contains(event.relatedTarget as Node)) {
        if (onBlurWithin) onBlurWithin();
      }
    };

    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);

    return () => {
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
    };
  }, [ref, onFocusWithin, onBlurWithin]);
}
