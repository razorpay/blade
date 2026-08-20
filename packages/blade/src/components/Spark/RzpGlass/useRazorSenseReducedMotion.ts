import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let mediaQuery: MediaQueryList | undefined;
const subscribers = new Set<() => void>();

const getReducedMotionMediaQuery = (): MediaQueryList | undefined => {
  if (mediaQuery) return mediaQuery;
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
  mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  return mediaQuery;
};

const notifySubscribers = (): void => subscribers.forEach((subscriber) => subscriber());

const addMediaQueryListener = (query: MediaQueryList): void => {
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', notifySubscribers);
    return;
  }
  query.addListener(notifySubscribers);
};

const removeMediaQueryListener = (query: MediaQueryList): void => {
  if (typeof query.removeEventListener === 'function') {
    query.removeEventListener('change', notifySubscribers);
    return;
  }
  query.removeListener(notifySubscribers);
};

const subscribe = (onStoreChange: () => void): (() => void) => {
  const query = getReducedMotionMediaQuery();
  if (!query) return () => undefined;
  if (subscribers.size === 0) addMediaQueryListener(query);
  subscribers.add(onStoreChange);

  return () => {
    subscribers.delete(onStoreChange);
    if (subscribers.size > 0 || mediaQuery !== query) return;
    removeMediaQueryListener(query);
    mediaQuery = undefined;
  };
};

const getSnapshot = (): boolean => getReducedMotionMediaQuery()?.matches ?? false;

const useRazorSenseReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, () => false);

export { useRazorSenseReducedMotion };
