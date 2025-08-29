import { DependencyList, EffectCallback } from 'react';
/**
 * Hook to run an effect on dependencies change after the component has *mounted*.
 * Core difference from `useEffect` is this will trigger effects after the very first render.
 *
 * @param effectCallback `useEffect` callback
 * @param dependencies `useEffect` dependencies
 */
export declare const useDidUpdate: (effectCallback: EffectCallback, dependencies: DependencyList) => void;
