import { ThemeTokens } from './theme';
import { DeepPartial } from '../../utils/isPartialMatchObjectKeys';
type OverrideTheme = {
    /**
     * base tokens
     */
    baseThemeTokens: ThemeTokens;
    /**
     * partial theme tokens
     */
    overrides: DeepPartial<ThemeTokens>;
};
/**
 * @deprecated Use `createTheme` from `@razorpay/blade/tokens` instead
 *
 * @description
 *
 * `overrideTheme` merges the `baseThemeTokens` and `overrides` and returns a new ThemeTokens object,
 * which you can pass into BladeProvider.
 *
 * @example
 * ```tsx
 * const customTheme = overrideTheme({
 *   baseThemeTokens: bladeTheme, // theme to override
 *   overrides: {
 *     colors: {
 *       onLight: {
 *         brand: {
 *           primary: {
 *             '500': 'hsla(222, 100%, 96%, 1)',
 *           },
 *         },
 *       },
 *     },
 *   },
 * });
 *
 * <BladeProvider themeTokens={customTheme} />
 * ```
 */
declare const overrideTheme: ({ baseThemeTokens, overrides }: OverrideTheme) => ThemeTokens;
export default overrideTheme;
