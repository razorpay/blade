import React from 'react';
import type { ButtonRayProps } from './types';
import { useLazyLayer } from '../useLazyLayer';

const loadLayer = (): Promise<React.ComponentType<ButtonRayProps>> =>
  import('./ButtonRayLayer').then(({ ButtonRayLayer }) => ButtonRayLayer);

/**
 * ButtonRay: Button's `hasRay` hover (internal; web). Its layer (Ray, his films, the RazorSense strip and the text wash:
 * ButtonRayLayer) is loaded only once a button turns it on, so a Button without `hasRay` doesn't carry Ray's runtime.
 */
const ButtonRay = (props: ButtonRayProps): React.ReactElement | null => {
  const Layer = useLazyLayer(loadLayer, props.isEnabled);
  return Layer ? <Layer {...props} /> : null;
};

export { ButtonRay };
