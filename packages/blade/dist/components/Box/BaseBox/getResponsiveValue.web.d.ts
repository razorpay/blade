import { MakeValueResponsive } from './types';
import { Breakpoints } from '../../../tokens/global';
/**
 * A helper function that returns the exact value for that breakpoint on passing the prop and breakpoint
 *
 * ## Usage
 *
 * ### Get base value of prop
 *
 * ```ts
 * getResponsiveValue(props.yourProp, 'base');
 * // yourProp="hi" -> "hi"
 * // yourProp={{ base: 'hello', m: 'hi' }} -> "hello"
 * // yourProp={{ m: 'hi' }} -> undefined
 * ```
 *
 * ### Get value of particular breakpoint
 *
 *
 * ```ts
 * getResponsiveValue(props.yourProp, 'm');
 * // yourProp="hi" -> undefined
 * // yourProp={{ base: 'hello', m: 'hi' }} -> "hi"
 * // yourProp={{ m: 'hi' }} -> "hi"
 * ```
 */
declare const getResponsiveValue: <T extends string | number | string[]>(value: MakeValueResponsive<T> | undefined, breakpoint?: keyof Breakpoints) => T | undefined;
export { getResponsiveValue };
