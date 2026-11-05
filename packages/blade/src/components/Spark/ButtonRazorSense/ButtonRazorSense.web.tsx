import React, { useEffect, useState } from 'react';
import type { ButtonRazorSenseProps } from './types';

/**
 * ButtonRazorSense: Button's `hasRazorSense` hover (internal; web). Its layer (ButtonRazorSenseLayer) is loaded only once a
 * button turns it on, so a Button without `hasRazorSense` doesn't carry it.
 */
const ButtonRazorSense = (props: ButtonRazorSenseProps): React.ReactElement | null => {
  const [Layer, setLayer] = useState<React.ComponentType<ButtonRazorSenseProps> | null>(null);

  useEffect(() => {
    let isMounted = true;
    import('./ButtonRazorSenseLayer')
      .then(({ ButtonRazorSenseLayer }) => {
        if (isMounted) setLayer(() => ButtonRazorSenseLayer);
      })
      .catch(() => {
        // it couldn't load (offline, a stale deploy): the button keeps its own hover
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return Layer ? <Layer {...props} /> : null;
};

export { ButtonRazorSense };
