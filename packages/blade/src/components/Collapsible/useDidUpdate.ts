import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

// TODO: add tests

/**
 * Hook to run an effect on dependencies change after the component has *mounted*.
 * Core difference from `useEffect` is this will trigger effects after the very first render.
 *
 * @param effectCallback `useEffect` callback
 * @param dependencies `useEffect` dependencies
 */
export const useDidUpdate = (
  effectCallback: EffectCallback,
  dependencies: DependencyList,
): void => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      // run normally after the very first render / mount
      return effectCallback();
    }

    isMounted.current = true;
    return undefined;

    // we don't want to rerun every time effectCallback changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
