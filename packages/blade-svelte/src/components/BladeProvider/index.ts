/**
 * BladeProvider — theme scope for Blade Svelte apps.
 *
 * @example
 * ```svelte
 * <script>
 *   import { BladeProvider, Button } from '@razorpay/blade-svelte/components';
 *   import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
 *
 *   const { theme } = createTheme({ brandColor: '#19BEA2', borderRadius: { medium: 16 } });
 * </script>
 *
 * <BladeProvider themeTokens={bladeTheme} colorScheme="light">
 *   <Button>Pay</Button>
 * </BladeProvider>
 * ```
 */
export { default as BladeProvider } from './BladeProvider.svelte';
export { useTheme } from './useTheme';
export type { Theme, BladeProviderProps, BladeThemeContextValue } from './types';
