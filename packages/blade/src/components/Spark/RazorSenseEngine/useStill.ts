import { useEffect, useRef, useState } from 'react';
import type React from 'react';

/**
 * A component's still (a WebP data URL), for when it can't animate: no WebGL2, a GPU that only draws on the CPU, an engine that
 * didn't load, or frames too slow to keep up. Each still is its own module, loaded only once it's needed, for the color scheme
 * it's needed in. Null until then (and while it loads).
 */
const useStill = (
  isNeeded: boolean,
  colorScheme: 'light' | 'dark',
  load: (colorScheme: 'light' | 'dark') => Promise<string>,
): string | null => {
  const [still, setStill] = useState<{ colorScheme: string; src: string } | null>(null);
  const loadRef = useRef(load);
  loadRef.current = load;

  useEffect(() => {
    if (!isNeeded) return undefined;
    let isMounted = true;
    loadRef
      .current(colorScheme)
      .then((src) => {
        if (isMounted) setStill({ colorScheme, src });
      })
      .catch(() => {
        // no still either: what it wraps shows as it would without it
      });
    return () => {
      isMounted = false;
    };
  }, [isNeeded, colorScheme]);

  return isNeeded && still?.colorScheme === colorScheme ? still.src : null;
};

/** a still laid over the box it stands in for */
const stillStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  pointerEvents: 'none',
};

export { useStill, stillStyle };
