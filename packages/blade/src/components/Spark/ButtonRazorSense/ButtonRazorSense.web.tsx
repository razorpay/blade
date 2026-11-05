import React from 'react';
import type { ButtonRazorSenseProps } from './types';
import { useLazyLayer } from '../useLazyLayer';

const loadLayer = (): Promise<React.ComponentType<ButtonRazorSenseProps>> =>
  import('./ButtonRazorSenseLayer').then(({ ButtonRazorSenseLayer }) => ButtonRazorSenseLayer);

/**
 * ButtonRazorSense: Button's `hasRazorSense` hover (internal; web). Its layer (ButtonRazorSenseLayer) is loaded only once a
 * button turns it on, so a Button without `hasRazorSense` doesn't carry it.
 */
const ButtonRazorSense = (props: ButtonRazorSenseProps): React.ReactElement | null => {
  const Layer = useLazyLayer(loadLayer, props.isEnabled);
  return Layer ? <Layer {...props} /> : null;
};

export { ButtonRazorSense };
