import { Breakpoints } from '../../../../tokens/global';
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
type MakeValueResponsive<T> = [T] extends [never] ? never : T | {
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
type MakeObjectResponsive<T, K extends keyof T = Extract<keyof T, string>> = {
    [P in K]: MakeValueResponsive<T[P]>;
};
export type { MakeObjectResponsive, MakeValueResponsive };
