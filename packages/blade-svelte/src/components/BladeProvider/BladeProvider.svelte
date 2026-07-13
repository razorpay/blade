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
  import { isValidColorSchemeInput } from './getColorScheme';
  import { resolveBladeTheme } from './resolveBladeTheme';
  import type { BladeProviderProps, BladeThemeContextValue } from './types';

  let {
    themeTokens,
    colorScheme: colorSchemeProp = 'light',
    children,
  }: BladeProviderProps = $props();

  const parentGetter = getBladeThemeContextGetter();
  const isRootProvider = !parentGetter;

  /** Local override from setColorScheme; cleared when colorScheme prop changes. */
  let colorSchemeOverride = $state<ColorSchemeNamesInput | undefined>(undefined);
  let viewportWidth = $state(768);
  let systemPreferenceVersion = $state(0);

  $effect(() => {
    // Track prop; clear local override when parent drives a new scheme
    const nextProp = colorSchemeProp;
    untrack(() => {
      colorSchemeOverride = undefined;
      void nextProp;
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
      }),
    ),
  );

  const setColorScheme = (next: ColorSchemeNamesInput): void => {
    if (!isValidColorSchemeInput(next)) {
      throw new Error(
        `[Blade: BladeProvider]: Expected color scheme to be one of [light, dark, system] but received ${next}`,
      );
    }
    colorSchemeOverride = next;
  };

  setBladeThemeContext((): BladeThemeContextValue => ({
    theme,
    themeTokens,
    colorScheme,
    setColorScheme,
    platform,
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
    const onResize = (): void => {
      viewportWidth = window.innerWidth;
    };
    window.addEventListener('resize', onResize);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (): void => {
      systemPreferenceVersion += 1;
    };
    mediaQuery.addEventListener('change', onSystemChange);

    return () => {
      window.removeEventListener('resize', onResize);
      mediaQuery.removeEventListener('change', onSystemChange);
    };
  });

  onDestroy(() => {
    if (isRootProvider && typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-blade-color-scheme');
      document.body.removeAttribute('data-theme');
    }
  });
</script>

<div
  data-blade-provider
  data-blade-color-scheme={colorScheme}
  style={cssVariableStyle}
>
  {@render children()}
</div>
