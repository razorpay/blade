import type { Breakpoints } from '~tokens/global';

/**
 * Returns the value or the responsive object with that value
 *
 * ## Usage
 *
 * Example if you pass string argument, return type will be string or responsive object with string value
 *
 * `MakeValueResponsive<string>`
 * ```ts
 * string |
 * {
 *  base?: string;
 *  xs?: string;
 *  s?: string;
 *  // ... other breakpoints
 * }
 * ```
 *
 */
type MakeValueResponsive<T> =
  | T
  | {
      // Using this instead of Record to maintain the jsdoc from breakpoints.ts
      [P in keyof Breakpoints]?: T;
    };

/**
 * Turns all the values in object into responsive object.
 *
 * ```ts
 * MakeObjectResponsive<{ hello: string}>
 *
 * // Outputs:
 * {
 *  hello: string | {
 *   base?: string;
 *   xs?: string;
 *   s?: string;
 *   // ... other breakpoints
 *  }
 * }
 * ```
 */
type MakeObjectResponsive<T> = { [P in keyof T]: MakeValueResponsive<T[P]> };

export { MakeObjectResponsive, MakeValueResponsive };
