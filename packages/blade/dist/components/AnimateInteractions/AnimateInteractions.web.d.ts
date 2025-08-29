import { default as React } from 'react';
import { AnimateInteractionsProps } from './types';
/**
 * ## AnimateInteractions
 *
 * AnimateInteractions is the utility preset that we offer to help you animate children when the parent is interacted.
 *
 * This is in a way equivalent to following CSS-
 * ```css
 * .parent:hover .child { }
 * ```
 *
 * ### Usage
 *
 * ```jsx
 * <AnimateInteractions
 *    motionTriggers={['hover']}
 *  > // <-- When this is hovered
 *  <Box>
 *    <Move
 *      motionTriggers={['on-animate-interactions']}
 *    > // <-- this animates in
 *      <Box />
 *    </Move>
 *  </Box>
 * </AnimateInteractions>
 * ```
 */
declare const AnimateInteractions: ({ children, motionTriggers, }: AnimateInteractionsProps) => React.ReactElement;
export { AnimateInteractions };
