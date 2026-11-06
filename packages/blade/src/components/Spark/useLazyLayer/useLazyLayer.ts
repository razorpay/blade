import type React from 'react';
import { useEffect, useState } from 'react';

/**
 * A Spark hover's layer, loaded on demand (Button's hasRazorSense / hasRay): its module is imported once the button is
 * enabled (a disabled or loading one never draws it), then kept. A failed load (offline, a stale deploy) leaves it null:
 * the button keeps its own hover.
 */
const useLazyLayer = <P>(
  load: () => Promise<React.ComponentType<P>>,
  isEnabled: boolean,
): React.ComponentType<P> | null => {
  const [Layer, setLayer] = useState<React.ComponentType<P> | null>(null);

  useEffect(() => {
    if (!isEnabled || Layer) return undefined;
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
  }, [isEnabled, Layer]);

  return Layer;
};

export { useLazyLayer };
