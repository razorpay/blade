/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useCallback, useInsertionEffect, useRef } from 'react';

/**
 * This hook is user-land implementation of the experimental `useEffectEvent` hook.
 * React docs: https://react.dev/learn/separating-events-from-effects#declaring-an-effect-event
 *
 * This hook is useful when you want to use a callback function inside a useEffect while keeping it "fresh" but you don't want to add it to the dependency array.
 */
function useCallbackRef<Args extends unknown[], Return>(
  callback: ((...args: Args) => Return) | undefined,
  deps: React.DependencyList = [],
) {
  const callbackRef = useRef<typeof callback>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useInsertionEffect(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Args) => callbackRef.current?.(...args), deps);
}

export { useCallbackRef };
