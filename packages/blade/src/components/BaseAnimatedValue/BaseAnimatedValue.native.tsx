import React from 'react';
import type { BaseAnimatedValueProps } from './types';

/**
 * Renders the current value without animating the swap.
 *
 * The web version leans on `AnimatePresence` to keep the outgoing copy mounted while it
 * leaves, and framer-motion has no React Native build — Blade's own `AnimatePresence.native`
 * is a passthrough for that reason. A native version needs the two copies held in state and
 * driven through Reanimated instead, which is worth doing when something on native actually
 * needs it rather than ahead of time.
 *
 * Rendering the value plainly keeps the module resolvable on native and keeps consumers
 * correct, just unanimated.
 */
const BaseAnimatedValue = ({ value, children }: BaseAnimatedValueProps): React.ReactElement => {
  // The fragment is load-bearing: the content is a ReactNode (often a bare string) and this
  // has to hand back a ReactElement.
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children ?? value}</>;
};

export { BaseAnimatedValue };
