import { default as React } from 'react';
import { ElevateProps } from './types';
/**
 * ## Elevate
 *
 * Elevate is one of the highlight presets that we expose from blade to help you elevate (add shadow) components based on interactions
 *
 * ### Usage
 *
 * #### Elevate up on hover
 *
 * ```jsx
 * <Elevate motionTriggers={['hover']}>
 *  <Card />
 * </Elevate>
 * ```
 *
 * #### Conditionally elevateF
 *
 * ```jsx
 * <Elevate isHighlighted={isHighlightedState}>
 *   <MyComponent />
 * </Elevate>
 * ```
 */
declare const Elevate: ({ children, isHighlighted, type, motionTriggers, }: ElevateProps) => React.ReactElement;
export { Elevate };
