import isEmpty from 'lodash/isEmpty';
import { Animated } from 'react-native';
import type { DimensionValue } from 'react-native';
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
const getResponsiveValue = <T extends string | number | string[] | DimensionValue>(
  value: MakeValueResponsive<T> | undefined,
  breakpoint: keyof Breakpoints = 'base',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value) ||
    typeof value === typeof Animated.AnimatedNode
  ) {
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
  // In React Native, we map the value `s` token on priority (since the breakpoint maps to mobiles in useBreakpoint hook).
  // We further look into smaller sizes, then we check base size.
  // Then we return the first non-undefined value in this priority
  //@ts-expect-error TODO: fix this - typeguard is not working and AnimatedNode is persisting even after the check above
  const priorityArray = [value.s, value.xs, value.base];
  return priorityArray.find((val) => val !== undefined);
};

export { getResponsiveValue };
