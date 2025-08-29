import { default as React } from 'react';
import { FadeProps } from './types';
/**
 * ## Fade
 *
 * Fade is one of the motion presets that we expose from blade to help you fade in / fade out components easily.
 *
 * ### Usage
 *
 * #### Fade in on mount
 *
 * ```jsx
 * <Fade>
 *   <Card />
 * </Fade>
 * ```
 *
 * #### Conditionally fade based on state
 *
 * ```jsx
 * <Fade isVisible={isVisibleState}>
 *   <Card />
 * </Fade>
 * ```
 */
declare const Fade: ({ children, isVisible, type, motionTriggers, shouldUnmountWhenHidden, delay, }: FadeProps) => React.ReactElement;
export { Fade };
