import { default as React } from 'react';
import { ScaleProps } from './types';
/**
 * ## Scale
 *
 * Scale is one of the highlight presets that we expose from blade to help you scale up or scale down components based on interactions
 *
 * ### Usage
 *
 * #### Scale up on hover
 *
 * ```jsx
 * <Scale motionTriggers={['hover']}>
 *  <Card />
 * </Scale>
 * ```
 *
 * #### Scale down on tap
 *
 * ```jsx
 * <Scale variant="scale-down" motionTriggers={['tap']}>
 *   <Card />
 * </Scale>
 * ```
 *
 * #### Conditionally scale
 *
 * ```jsx
 * <Scale isHighlighted={isHighlightedState}>
 *   <MyComponent />
 * </Scale>
 * ```
 */
declare const Scale: ({ children, isHighlighted, type, variant, motionTriggers, }: ScaleProps) => React.ReactElement;
export { Scale };
