import { default as React } from 'react';
import { StaggerProps } from './types';
/**
 * ## Stagger
 *
 * Stagger is a utility motion preset we expose from blade to help you implement stagger animations.
 *
 * You can use any of the base entry / exit presets like `Fade`, `Move`, `Slide` inside of it and the components will appear one after the other instead of all at once.
 *
 * **Note:** Unlike other motion presets, Stagger is not an enhancer components and renders a Box instead. You can use BoxProps on this component.
 *
 * ### Usage
 *
 * #### Move with Stagger
 *
 * ```jsx
 * <Stagger>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 * </Stagger>
 * ```
 *
 * #### Conditionally make the parent visible or invisible
 *
 * `isVisible` prop in this case should be on Stagger instead of children preset component
 *
 * ```jsx
 * <Stagger isVisible={isVisibleState}>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 * </Stagger>
 * ```
 *
 */
declare const Stagger: ({ children, isVisible, type, shouldUnmountWhenHidden, delay, motionTriggers, ...boxProps }: StaggerProps) => React.ReactElement;
export { Stagger };
