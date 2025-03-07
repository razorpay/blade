/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

// Prevent webpack from importing this:
// https://github.com/webpack/webpack/issues/14814#issuecomment-1536757985
// https://github.com/radix-ui/primitives/issues/2796
const useReactInsertionEffect = (React as any)[' useInsertionEffect '.trim().toString()];
const useInsertionEffectFallback = useReactInsertionEffect || useIsomorphicLayoutEffect;

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
  const callbackRef = useRef<typeof callback>(callback);

  useInsertionEffectFallback(() => {
    callbackRef.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Args) => callbackRef.current?.(...args), deps);
}

export { useCallbackRef };
