<script lang="ts">
  /**
   * Storybook theme decorator — wraps each story in BladeProvider.
   * Reads colorScheme / brandColor from Storybook globals via props.
   */
  import type { Snippet } from 'svelte';
  import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
  import type { ColorSchemeNamesInput, ThemeTokens } from '@razorpay/blade-core/tokens';
  import BladeProvider from '../src/components/BladeProvider/BladeProvider.svelte';

  let {
    colorScheme = 'light',
    brandColor,
    skipProvider = false,
    children,
  }: {
    colorScheme?: ColorSchemeNamesInput;
    brandColor?: string;
    /** Playground stories bring their own BladeProvider + createTheme. */
    skipProvider?: boolean;
    children: Snippet;
  } = $props();

  const themeTokens = $derived.by((): ThemeTokens => {
    if (brandColor) {
      try {
        return createTheme({ brandColor }).theme;
      } catch (error) {
        console.warn(
          '[BladeThemeDecorator]: Invalid brandColor, falling back to default theme',
          brandColor,
          error,
        );
        return bladeTheme;
      }
    }
    return bladeTheme;
  });
</script>

{#if skipProvider}
  {@render children()}
{:else}
  <BladeProvider {themeTokens} {colorScheme}>
    {@render children()}
  </BladeProvider>
{/if}
