import { isEqual, merge, isPartialMatchObjectKeys } from '../../utils';
import { paymentsTheme } from '../theme';
import type { Theme } from './theme.d';

type OverrideTheme = {
  baseTheme: Theme;
  overrides: Pick<Theme, keyof Theme>;
};

const overrideTheme = ({ baseTheme, overrides }: OverrideTheme): Theme => {
  /**
   * [] check if the theme is of type base theme else throw error for ts users
   * [] check if the overrides are valid else throw error for ts users
   * [] write tests
   * [] Make autocomplete work for TS users in properties
   * [x] check if the overrides are valid else throw error for non-ts users
   * [x] check if the theme is of type base theme else throw error for non-ts users
   * [x] deep merge theme and overrides and return the new theme
   */
  if (!isEqual(baseTheme, paymentsTheme)) {
    throw new Error('[Blade:overrideTheme]: The base theme provided is not a valid Blade theme');
  }

  if (!isPartialMatchObjectKeys({ objectToMatch: overrides, objectToInspect: baseTheme })) {
    throw new Error('[Blade:overrideTheme]: The overrides object is not valid');
  }

  return merge(baseTheme, overrides);
};

export default overrideTheme;
