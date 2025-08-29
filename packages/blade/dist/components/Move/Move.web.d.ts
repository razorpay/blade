import { default as React } from 'react';
import { MoveProps } from './types';
/**
 * ## Move
 *
 * Move is one of the motion presets that we expose from blade to help you make components appear / disappear with move
 *
 * ### Usage
 *
 * #### Move in on mount
 *
 * ```jsx
 * <Move>
 *   <Card />
 * </Move>
 * ```
 *
 * #### Conditionally move based on state
 *
 * ```jsx
 * <Move isVisible={isVisibleState}>
 *   <Card />
 * </Move>
 * ```
 */
declare const Move: ({ children, type, isVisible, motionTriggers, shouldUnmountWhenHidden, delay, }: MoveProps) => React.ReactElement;
export { Move };
