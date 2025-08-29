import { default as React } from 'react';
/**
 * This hook is user-land implementation of the experimental `useEffectEvent` hook.
 * React docs: https://react.dev/learn/separating-events-from-effects#declaring-an-effect-event
 *
 * This hook is useful when you want to use a callback function inside a useEffect while keeping it "fresh" but you don't want to add it to the dependency array.
 */
declare function useCallbackRef<Args extends unknown[], Return>(callback: ((...args: Args) => Return) | undefined, deps?: React.DependencyList): (...args: Args) => Return | undefined;
export { useCallbackRef };
