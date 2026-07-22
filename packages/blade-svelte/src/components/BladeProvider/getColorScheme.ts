import type { ColorSchemeNames, ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';

const colorSchemeNamesInput: ColorSchemeNamesInput[] = ['light', 'dark', 'system'];

/**
 * Resolve a color scheme input to a concrete light/dark value.
 * `system` uses `prefers-color-scheme` when available.
 */
export const getColorScheme = (colorScheme: ColorSchemeNamesInput = 'light'): ColorSchemeNames => {
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }

  const supportsMatchMedia =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function';

  if (
    colorScheme === 'system' &&
    supportsMatchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

export const isValidColorSchemeInput = (
  colorScheme: string,
): colorScheme is ColorSchemeNamesInput =>
  colorSchemeNamesInput.includes(colorScheme as ColorSchemeNamesInput);

export { colorSchemeNamesInput };
