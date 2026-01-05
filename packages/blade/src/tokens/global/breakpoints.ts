export type Breakpoints = Readonly<{
  /**
   * `base` is used for responsive styling following a **mobile first** approach. It starts from 0px till the next existing token
   *
   * Think of this as styles without any media query.
   *
   * ### Example
   *
   * This code will set margin as `spacing.2` on "m" size screens and above. And as `spacing.1` on less than "m" size screens
   * ```jsx
   * <Box margin={{ base: 'spacing.1', m: 'spacing.2' }} />
   * ```
   *
   * This roughly translates into -
   *
   * ```
   * .Box {
   *  margin: 'spacing.1';
   * }
   *
   * ＠media screen and (min-width: 768px) {
   *  .Box {
   *    margin: 'spacing.2';
   *  }
   * }
   * ```
   */
  base: number;
  /**
   * `@media screen and (min-width: 320px)`
   *
   * Small Mobiles
   */
  xs: number;
  /**
   * `@media screen and (min-width: 480px)`
   *
   * Mobiles and Small Tablets
   */
  s: number;
  /**
   * `@media screen and (min-width: 768px)`
   *
   * Medium and Large Tablets.
   *
   * Dimensions with `m` and above can be treated as desktop in mobile-first approach (with min-width).
   * Hence this breakpoint can be used for desktop styling.
   *
   * E.g. next example will keep flexDirection `row` on mobiles and `column` on large tablets, desktop, and larger screens
   *
   * ```jsx
   * <Box display="flex" flexDirection={{ base: 'row', m: 'column' }} />
   * ```
   *
   */
  m: number;
  /**
   * `@media screen and (min-width: 1024px)`
   *
   * Desktop
   */
  l: number;
  /**
   * `@media screen and (min-width: 1200px)`
   *
   * HD Desktop
   */
  xl: number;
}>;

export const breakpoints: Breakpoints = {
  base: 0,
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};
