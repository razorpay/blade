import React, { useEffect, useState } from 'react';
import type { ButtonRayProps } from './types';

/**
 * ButtonRay: Button's `hasRay` hover (internal; web). Its layer (Ray, his films, the RazorSense strip and the text wash:
 * ButtonRayLayer) is loaded only once a button turns it on, so a Button without `hasRay` doesn't carry Ray's runtime.
 */
const ButtonRay = (props: ButtonRayProps): React.ReactElement | null => {
  const [Layer, setLayer] = useState<React.ComponentType<ButtonRayProps> | null>(null);

  useEffect(() => {
    let isMounted = true;
    void import('./ButtonRayLayer').then(({ ButtonRayLayer }) => {
      if (isMounted) setLayer(() => ButtonRayLayer);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return Layer ? <Layer {...props} /> : null;
};

export { ButtonRay };
