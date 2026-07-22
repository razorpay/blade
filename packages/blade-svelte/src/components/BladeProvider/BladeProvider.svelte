<script module lang="ts">
  declare const __DEV__: boolean;
</script>

<script lang="ts">
  import { onDestroy, onMount, untrack } from 'svelte';
  import {
    cssVariablesToInlineStyle,
    themeToCssVariables,
  } from '@razorpay/blade-core/utils';
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import {
    getBladeThemeContextGetter,
    setBladeThemeContext,
  } from './bladeThemeContext';
  import { colorSchemeNamesInput, isValidColorSchemeInput } from './getColorScheme';
  import { resolveBladeTheme } from './resolveBladeTheme';
  import type { BladeProviderProps, BladeThemeContextValue } from './types';

  let {
    themeTokens,
    colorScheme: colorSchemeProp = 'light',
    componentConfig,
    fontFaceCss,
    children,
  }: BladeProviderProps = $props();

  const parentGetter = getBladeThemeContextGetter();
  const isRootProvider = !parentGetter;

  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    if (!themeTokens) {
      throw new Error(
        `[Blade: BladeProvider]: Expected valid themeTokens of type ThemeTokens to be passed but found ${typeof themeTokens}`,
      );
    }
    if (colorSchemeProp && !isValidColorSchemeInput(colorSchemeProp)) {
      throw new Error(
        `[Blade: BladeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${colorSchemeProp}`,
      );
    }
  }

  /** Local override from setColorScheme; cleared when colorScheme prop changes. */
  let colorSchemeOverride = $state<ColorSchemeNamesInput | undefined>(undefined);
  let viewportWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 0);
  let systemPreferenceVersion = $state(0);

  $effect(() => {
    // Track prop; clear local override when parent drives a new scheme
    colorSchemeProp;
    untrack(() => {
      colorSchemeOverride = undefined;
    });
  });

  const colorSchemeInput = $derived(colorSchemeOverride ?? colorSchemeProp);
  const resolved = $derived.by(() => {
    void systemPreferenceVersion;
    return resolveBladeTheme({
      themeTokens,
      colorSchemeInput,
      viewportWidth,
    });
  });
  const colorScheme = $derived(resolved.colorScheme);
  const platform = $derived(resolved.platform);
  const theme = $derived(resolved.theme);

  const cssVariableStyle = $derived(
    cssVariablesToInlineStyle(
      themeToCssVariables({
        colors: theme.colors,
        elevation: theme.elevation,
        border: theme.border,
        typography: theme.typography,
      }),
    ),
  );

  const setColorScheme = (next: ColorSchemeNamesInput): void => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      if (!isValidColorSchemeInput(next)) {
        throw new Error(
          `[Blade: BladeProvider]: Expected color scheme to be one of [light, dark, system] but received ${next}`,
        );
      }
    }
    colorSchemeOverride = next;
  };

  setBladeThemeContext((): BladeThemeContextValue => ({
    theme,
    themeTokens,
    colorScheme,
    setColorScheme,
    platform,
    componentConfig,
  }));

  $effect(() => {
    if (!isRootProvider || typeof document === 'undefined') {
      return;
    }
    const scheme = colorScheme;
    document.documentElement.setAttribute('data-blade-color-scheme', scheme);
    if (scheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  });

  onMount(() => {
    viewportWidth = window.innerWidth;
    let resizeRaf = 0;
    const onResize = (): void => {
      if (resizeRaf) {
        return;
      }
      resizeRaf = requestAnimationFrame(() => {
        viewportWidth = window.innerWidth;
        resizeRaf = 0;
      });
    };
    window.addEventListener('resize', onResize);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (): void => {
      systemPreferenceVersion += 1;
    };
    mediaQuery.addEventListener('change', onSystemChange);

    return () => {
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
      }
      window.removeEventListener('resize', onResize);
      mediaQuery.removeEventListener('change', onSystemChange);
    };
  });

  onDestroy(() => {
    if (isRootProvider && typeof document !== 'undefined') {
      const remainingProviders = document.querySelectorAll('[data-blade-provider]');
      if (remainingProviders.length === 0) {
        document.documentElement.removeAttribute('data-blade-color-scheme');
        document.body.removeAttribute('data-theme');
      }
    }
  });
</script>

<div
  data-blade-provider
  data-blade-color-scheme={colorScheme}
  style={cssVariableStyle}
>
  {#if fontFaceCss}
    {@const existingFontFaces = typeof document !== 'undefined'
      ? document.querySelector('style[data-blade-font-faces]')
      : null}
    {#if !existingFontFaces || existingFontFaces.textContent !== fontFaceCss}
      <svelte:element this={'style'} data-blade-font-faces>
        {fontFaceCss}
      </svelte:element>
    {/if}
  {/if}
  {@render children()}
</div>
