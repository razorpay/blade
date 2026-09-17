import type { ColorSchemeNames, ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
import { isBrowser } from '@razorpay/blade-core/utils';

const colorSchemeNamesInput: ColorSchemeNamesInput[] = ['light', 'dark', 'system'];

/**
 * Resolve a color scheme input to a concrete light/dark value.
 * `system` uses `prefers-color-scheme` when available, or `systemPrefersDark` when passed
 * (e.g. from a `matchMedia` listener in BladeProvider).
 */
export const getColorScheme = (
  colorScheme: ColorSchemeNamesInput = 'light',
  systemPrefersDark?: boolean,
): ColorSchemeNames => {
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  if (systemPrefersDark != null) {
    return systemPrefersDark ? 'dark' : 'light';
  }

  if (isBrowser() && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export const isValidColorSchemeInput = (
  colorScheme: string,
): colorScheme is ColorSchemeNamesInput =>
  colorSchemeNamesInput.includes(colorScheme as ColorSchemeNamesInput);

export { colorSchemeNamesInput };
