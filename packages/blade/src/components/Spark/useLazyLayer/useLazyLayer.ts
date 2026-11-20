import type React from 'react';
import { useEffect, useState } from 'react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const motionQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(REDUCED_MOTION)
    : null;

/**
 * Whether reduced motion is on, followed as it changes (the PR review: it was read once). No Spark hover plays with it, so
 * none is loaded or kept. (The GPU is checked once a layer is in: probing WebGL at the page's start is a long task on some GPUs.)
 */
const useReducedMotion = (): boolean => {
  const [isReduced, setIsReduced] = useState(() => Boolean(motionQuery()?.matches));
  useEffect(() => {
    const query = motionQuery();
    if (!query || typeof query.addEventListener !== 'function') return undefined;
    const onChange = (): void => setIsReduced(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return isReduced;
};

/**
 * A Spark hover's layer, loaded on demand (Button's aiHover): its module is imported once the button is
 * enabled (a disabled or loading one never draws it), then kept. With reduced motion it's not loaded, and a loaded one is
 * taken off (its canvases freed, the button's own hover back) until reduced motion is turned off again. A failed load
 * (offline, a stale deploy) leaves it null: the button keeps its own hover.
 */
const useLazyLayer = <P>(
  load: () => Promise<React.ComponentType<P>>,
  isEnabled: boolean,
): React.ComponentType<P> | null => {
  const [Layer, setLayer] = useState<React.ComponentType<P> | null>(null);
  const isReduced = useReducedMotion();

  useEffect(() => {
    if (!isEnabled || Layer || isReduced) return undefined;
    let isMounted = true;
    load()
      .then((loaded) => {
        if (isMounted) setLayer(() => loaded);
      })
      .catch(() => {
        // the button keeps its own hover
      });
    return () => {
      isMounted = false;
    };
    // `load` is a module-level import: it never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, Layer, isReduced]);

  return isReduced ? null : Layer;
};

export { useLazyLayer };
