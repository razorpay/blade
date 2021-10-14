import cloneDeep from '../../utils/cloneDeep';
import isEqual from '../../utils/isEqual';
import merge from '../../utils/merge';
import isPartialMatchObjectKeys from '../../utils/isPartialMatchObjectKeys';
import type { DeepPartial } from '../../utils/isPartialMatchObjectKeys';
import paymentTheme from './paymentTheme';
import bankingTheme from './bankingTheme';
import type { ThemeTokens } from './theme.d';

type OverrideTheme = {
  baseThemeTokens: ThemeTokens;
  overrides: DeepPartial<ThemeTokens>;
};

const overrideTheme = ({ baseThemeTokens, overrides }: OverrideTheme): ThemeTokens => {
  // TODO: wrap this check inside a __DEV__ flag so it gets trimmed off in production
  if (!isEqual(baseThemeTokens, paymentTheme) && !isEqual(baseThemeTokens, bankingTheme)) {
    throw new Error('[Blade:overrideTheme]: The base theme provided is not a valid Blade theme');
  }

  if (
    !isPartialMatchObjectKeys<ThemeTokens>({
      objectToMatch: overrides,
      objectToInspect: baseThemeTokens,
    })
  ) {
    throw new Error('[Blade:overrideTheme]: The overrides object is not valid');
  }

  // Need to clone before merging since merge changes/mutates the actual object
  return merge(cloneDeep(baseThemeTokens), overrides);
};

export default overrideTheme;
