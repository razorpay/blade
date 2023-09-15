import isEmpty from 'lodash/isEmpty';
import type { MakeValueResponsive } from './types';
import type { Breakpoints } from '~tokens/global';

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
const getResponsiveValue = <T extends string | number | string[]>(
  value: MakeValueResponsive<T> | undefined,
  breakpoint: keyof Breakpoints = 'base',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) {
    /**
     * Flat values like string or number should only be added in `base` styles.
     *
     * E.g. if you pass `display="block"`, it should only put that style in base style and not in media queries
     * ```js
     * // Output should be just this-
     * display: block;
     *
     * // And not this-
     * display: block;
     * media (min-width: s) {
     *   display: block;
     * }
     *
     * media (min-width: m) {
     *   display: block
     * }
     * //  and more ...
     * ```
     */
    if (breakpoint === 'base') {
      return value;
    }

    return undefined;
  }

  if (isEmpty(value)) {
    return undefined;
  }

  return value[breakpoint];
};

export { getResponsiveValue };
