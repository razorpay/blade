<script module lang="ts">
  declare const __DEV__: boolean;
</script>

<script lang="ts">
  import { onDestroy, onMount, untrack } from 'svelte';
  import {
    cssVariablesToInlineStyle,
    getDeviceType,
    subscribeToBreakpoint,
    themeToCSSVariables,
  } from '@razorpay/blade-core/utils';
  import type { Breakpoint } from '@razorpay/blade-core/utils';
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import {
    getBladeThemeContextGetter,
    setBladeThemeContext,
  } from './bladeThemeContext';
  import { setBreakpointContext } from './breakpointContext';
  import type { BreakpointState } from './breakpointContext';
  import { colorSchemeNamesInput, isValidColorSchemeInput } from './getColorScheme';
  import { resolveBladeTheme } from './resolveBladeTheme';
  import type { BladeProviderProps, BladeThemeContextValue } from './types';

  let {
    themeTokens,
    colorScheme: colorSchemeProp = 'light',
    componentConfig,
    fontFaceCSS,
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
  let matchedBreakpoint = $state<Breakpoint | undefined>(undefined);
  let systemPrefersDark = $state(false);
  const matchedDeviceType = $derived(getDeviceType(matchedBreakpoint));

  /*
   * Known SSR limitation: during server-side rendering, `systemPrefersDark`
   * is `false` and `matchedBreakpoint` is `undefined` (onMount does not run on
   * the server). This means `colorScheme: 'system'` resolves to `'light'` and
   * the device type resolves to `'desktop'` (same default as React Blade's
   * `useBreakpoint`) in the server-rendered HTML. After hydration, onMount sets
   * the actual values, which may cause a brief flash from light→dark and
   * desktop→mobile typography. This is acceptable for the initial release; a
   * future improvement could defer `data-blade-color-scheme` and the CSS
   * variable inline style until after mount to avoid the flash.
   */

  $effect(() => {
    // Track prop; clear local override when parent drives a new scheme
    colorSchemeProp;
    untrack(() => {
      colorSchemeOverride = undefined;
    });
  });

  const colorSchemeInput = $derived(colorSchemeOverride ?? colorSchemeProp);
  const resolved = $derived.by(() =>
    resolveBladeTheme({
      themeTokens,
      colorSchemeInput,
      deviceType: matchedDeviceType,
      systemPrefersDark,
    }),
  );
  const colorScheme = $derived(resolved.colorScheme);
  const platform = $derived(resolved.platform);
  const theme = $derived(resolved.theme);

  const cssVariableStyle = $derived(
    cssVariablesToInlineStyle(
      themeToCSSVariables({
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
          `[Blade: BladeProvider]: Expected color scheme to be one of [${colorSchemeNamesInput.toString()}] but received ${next}`,
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

  // Getters keep this reactive when read inside consumers' `$derived`/templates.
  const breakpointState: BreakpointState = {
    get matchedBreakpoint() {
      return matchedBreakpoint;
    },
    get matchedDeviceType() {
      return matchedDeviceType;
    },
  };
  setBreakpointContext(() => breakpointState);

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
    const unsubscribeBreakpoint = subscribeToBreakpoint(themeTokens.breakpoints, (next) => {
      matchedBreakpoint = next;
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncSystemPreference = (): void => {
      systemPrefersDark = mediaQuery.matches;
    };
    syncSystemPreference();
    mediaQuery.addEventListener('change', syncSystemPreference);

    return () => {
      unsubscribeBreakpoint();
      mediaQuery.removeEventListener('change', syncSystemPreference);
    };
  });

  onDestroy(() => {
    if (isRootProvider && typeof document !== 'undefined') {
      const remainingProviders = document.querySelectorAll('[data-blade-provider]');
      if (remainingProviders.length <= 1) {
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
  {#if fontFaceCSS}
    <svelte:element this={'style'} data-blade-font-faces>
      {fontFaceCSS}
    </svelte:element>
  {/if}
  {@render children()}
</div>
