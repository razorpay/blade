import type React from 'react';
import { useEffect, useState } from 'react';
import { canHover, whenHoverOrKeyboardFocus } from './hoverDevice';
import { errorText, noteHover } from './hoverLog';

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
 * enabled (a disabled or loading one never draws it), then kept. On a device that can't hover (a phone) it waits for a keyboard
 * focus anywhere on the page (a tablet's keyboard) or a pointer that can hover: a phone downloads none of it (the layers and their
 * code were 12 KB gzipped a page, for nothing to play). With reduced motion it's not loaded, and a loaded one is
 * taken off (its canvases freed, the button's own hover back) until reduced motion is turned off again. A failed load
 * (offline, a stale deploy) leaves it null: the button keeps its own hover.
 */
const useLazyLayer = <P>(
  load: () => Promise<React.ComponentType<P>>,
  isEnabled: boolean,
  /** which hover, for hoverLog */
  name = 'hover',
): React.ComponentType<P> | null => {
  const [Layer, setLayer] = useState<React.ComponentType<P> | null>(null);
  const isReduced = useReducedMotion();
  const [canLoad, setCanLoad] = useState(canHover);

  useEffect(() => {
    if (canLoad || !isEnabled) return undefined;
    noteHover(name, 'waiting: nothing here can hover (a keyboard focus or a mouse loads it)');
    return whenHoverOrKeyboardFocus(null, () => setCanLoad(true));
  }, [canLoad, isEnabled]);

  useEffect(() => {
    if (isEnabled && canLoad && !Layer && isReduced) noteHover(name, 'off: reduced motion');
    if (!isEnabled || !canLoad || Layer || isReduced) return undefined;
    let isMounted = true;
    load()
      .then((loaded) => {
        if (isMounted) setLayer(() => loaded);
      })
      .catch((error: unknown) => {
        // the button keeps its own hover (and the browser keeps a failed import for the page's life: no retry)
        noteHover(name, `off: its layer's code failed to load (${errorText(error)})`);
      });
    return () => {
      isMounted = false;
    };
    // `load` is a module-level import: it never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled, canLoad, Layer, isReduced]);

  return isReduced ? null : Layer;
};

export { useLazyLayer };
