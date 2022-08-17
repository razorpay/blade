import paymentTheme from './paymentTheme';
import bankingTheme from './bankingTheme';
import type { Colors, ThemeTokens } from './theme.d';
import type { DeepPartial } from '~utils';
import { isEqual, merge, cloneDeep, isPartialMatchObjectKeys } from '~utils';

type OverrideTheme = {
  baseThemeTokens: ThemeTokens;
  overrides: DeepPartial<ThemeTokens>;
  baseGlobalTokens?: Colors,
  overrideGlobalTokens?: DeepPartial<Colors>,
};

const overrideTheme = ({ baseThemeTokens, overrides }: OverrideTheme): ThemeTokens => {
  // TODO: wrap this check inside a __DEV__ flag so it gets trimmed off in production
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

  // Need to clone before merging since merge changes/mutates the actual object
  return merge(cloneDeep(baseThemeTokens), overrides);
};

export default overrideTheme;
