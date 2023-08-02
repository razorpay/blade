import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import paymentTheme from './paymentTheme';
import bankingTheme from './bankingTheme';
import type { ThemeTokens } from './theme';
import { isPartialMatchObjectKeys } from '~utils/isPartialMatchObjectKeys';
import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';

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
 * @description
 *
 * `overrideTheme` merges the `baseThemeTokens` and `overrides` and returns a new ThemeTokens object,
 * which you can pass into BladeProvider.
 *
 * @example
 * ```tsx
 * const customTheme = overrideTheme({
 *   baseThemeTokens: paymentTheme, // theme to override
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
const overrideTheme = ({ baseThemeTokens, overrides }: OverrideTheme): ThemeTokens => {
  if (__DEV__) {
    if (!isEqual(baseThemeTokens, paymentTheme) && !isEqual(baseThemeTokens, bankingTheme)) {
      throw new Error(
        '[@razorpay/blade:overrideTheme]: The base theme provided is not a valid Blade theme',
      );
    }

    if (
      !isPartialMatchObjectKeys<ThemeTokens>({
        objectToMatch: overrides,
        objectToInspect: baseThemeTokens,
      })
    ) {
      throw new Error('[@razorpay/blade:overrideTheme]: The overrides object is not valid');
    }
  }

  // Need to clone before merging since merge changes/mutates the actual object
  return merge(cloneDeep(baseThemeTokens), overrides);
};

export default overrideTheme;
