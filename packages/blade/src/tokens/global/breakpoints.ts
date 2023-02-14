export type Breakpoints = Readonly<{
  /**
   * `base` is used for base styling. It starts from 0px till the next existing token
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
   * ```js
   * styled.div(() => ({
   *   margin: 'spacing.1',
   *   [`@media screen and (min-width: 768px)`]: {
   *     Box: {
   *       margin: 'spacing.2'
   *     }
   *   }
   * }))
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
   * Medium and Large Tablets. Would be ideal to use this as breakpoint while writing desktop css
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

const breakpoints: Breakpoints = {
  base: 0,
  xs: 320,
  s: 480,
  m: 768,
  l: 1024,
  xl: 1200,
};

export default breakpoints;
