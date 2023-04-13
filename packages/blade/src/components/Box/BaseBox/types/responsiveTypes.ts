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
// When type is `never`, we just want to return `never` rather than { base: never, ...etc } since that prop is intended to be never used
// Explaination of [T] extends [never] -> https://stackoverflow.com/questions/65492464/typescript-never-type-condition
type MakeValueResponsive<T> = [T] extends [never]
  ? never
  :
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
