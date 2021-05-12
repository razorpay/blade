import { cloneDeep, isEqual, merge, isPartialMatchObjectKeys, DeepPartial } from '../../utils';
import { paymentTheme, bankingTheme } from '../theme';
import type { Theme } from '../theme';

type OverrideTheme = {
  baseTheme: Theme;
  overrides: DeepPartial<Theme>;
};

const overrideTheme = ({ baseTheme, overrides }: OverrideTheme): Theme => {
  // TODO: wrap this check inside a __DEV__ flag so it gets trimmed off in production
  if (!isEqual(baseTheme, paymentTheme) && !isEqual(baseTheme, bankingTheme)) {
    throw new Error('[Blade:overrideTheme]: The base theme provided is not a valid Blade theme');
  }

  if (!isPartialMatchObjectKeys<Theme>({ objectToMatch: overrides, objectToInspect: baseTheme })) {
    throw new Error('[Blade:overrideTheme]: The overrides object is not valid');
  }

  // Need to clone before merging since merge changes/mutates the actual object
  return merge(cloneDeep(baseTheme), overrides);
};

export default overrideTheme;
