import { getBladeThemeContextGetter } from './bladeThemeContext';
import type { BladeThemeContextValue } from './types';

/**
 * Access the nearest BladeProvider theme context.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTheme } from '@razorpay/blade-svelte/components';
 *   const { theme, colorScheme, setColorScheme } = useTheme();
 * </script>
 * ```
 */
export function useTheme(): BladeThemeContextValue {
  const getter = getBladeThemeContextGetter();

  if (!getter) {
    throw new Error(
      '[Blade: useTheme]: BladeProvider is missing. Wrap your app in <BladeProvider themeTokens={bladeTheme}>.',
    );
  }

  return getter();
}
