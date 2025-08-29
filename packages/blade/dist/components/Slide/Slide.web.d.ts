import { default as React } from 'react';
import { SlideProps } from './types';
/**
 * ## Slide
 *
 * Slide is one of the motion presets that we expose from blade to help you make components slide in from outside of viewport
 *
 * If you're looking for subtle movement on enter in the viewport itself, checkout `Move` preset instead.
 *
 * ### Usage
 *
 * #### Slide in on mount
 *
 * ```jsx
 * <Slide direction="bottom">
 *   <Card />
 * </Slide>
 * ```
 *
 * #### Conditionally slide based on state
 *
 * ```jsx
 * <Slide isVisible={isVisibleState}>
 *   <Card />
 * </Slide>
 * ```
 */
declare const Slide: ({ children, type, direction, isVisible, motionTriggers, shouldUnmountWhenHidden, fromOffset, delay, }: SlideProps) => React.ReactElement;
export { Slide };
