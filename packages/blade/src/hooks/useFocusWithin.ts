/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { FocusEvent, HTMLAttributes } from 'react';
import { useCallback, useRef } from 'react';

interface FocusWithinProps {
  isDisabled?: boolean;
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

interface FocusWithinResult {
  onFocus?: HTMLAttributes<HTMLElement>['onFocus'];
  onBlur?: HTMLAttributes<HTMLElement>['onBlur'];
}

export function useFocusWithin(props: FocusWithinProps): FocusWithinResult {
  const { isDisabled, onFocusWithinChange } = props;
  const isFocusWithin = useRef(false);

  const onBlur = useCallback(
    (e: FocusEvent) => {
      // When focus left self
      const isLeavingSelf = !e.currentTarget.contains(e.relatedTarget as Element);
      if (isFocusWithin.current && isLeavingSelf) {
        isFocusWithin.current = false;
        onFocusWithinChange?.(false);
      }
    },
    [onFocusWithinChange],
  );

  const onFocus = useCallback(() => {
    if (!isFocusWithin.current) {
      onFocusWithinChange?.(true);
      isFocusWithin.current = true;
    }
  }, [onFocusWithinChange]);

  if (isDisabled) {
    return {};
  }

  return {
    onFocus,
    onBlur,
  };
}
