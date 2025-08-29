import { default as React } from 'react';
/**
 * Hook to delay the state change
 *
 * This is used to delay the active step change to allow for transitions to finish
 * This prevents the popover's footer from changing it's JSX while it's transitioning
 */
declare function useDelayedState<T>(initialState: T, delay: number): [T, React.Dispatch<React.SetStateAction<T>>];
/**
 * Keep track of when we are transitioning between steps
 *
 * This is used to prevent the popover from jumping to the next step before animations are finished
 */
declare const useIsTransitioningBetweenSteps: (activeStep: number, transitionDelay: number) => boolean;
declare function smoothScroll(element: Element | null, options: ScrollIntoViewOptions): Promise<unknown>;
declare function useIntersectionObserver(elementRef: React.RefObject<Element>, { threshold, root, rootMargin }: IntersectionObserverInit): IntersectionObserverEntry | undefined;
declare const useLockBodyScroll: (shouldLock: boolean) => void;
export { useDelayedState, useIsTransitioningBetweenSteps, smoothScroll, useIntersectionObserver, useLockBodyScroll, };
