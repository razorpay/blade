<script lang="ts">
  import type {
    AppBarLeadingSlot,
    ButtonSlot,
    CardSlot,
    StyleOverride,
  } from '@razorpay/blade-core/styles';
  import { bladeTheme, type ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import BladeProvider from '../../BladeProvider.svelte';
  import Text from '../../../Typography/Text/Text.svelte';
  import CheckoutPreview from './CheckoutPreview.svelte';
  import StudioPanel from './studio/StudioPanel.svelte';
  import {
    DEFAULT_CUSTOM_BRAND_COLOR,
    type RadiusKey,
    buildThemeBundle,
  } from './checkoutPlaygroundTheme';
  import {
    CHECKOUT_INITIAL_CSS_VAR_VALUES,
    CHECKOUT_SLOT_CATALOG,
    CHECKOUT_STYLE_COMPONENTS,
    buildDynamicUtilityCss,
    buildPreviewVarsStyle,
    collectCssVarsFromClassNames,
    createInitialCheckoutSlotClasses,
    resolveStyleOverride,
    type CheckoutStyleComponent,
  } from './checkoutPlaygroundStyleOverride';

  let brandLabel = $state('Razorpay');
  let customBrandColor = $state(DEFAULT_CUSTOM_BRAND_COLOR);
  let radiusPreset = $state('default');
  let radiusOverride = $state<Record<RadiusKey, number> | null>(null);
  let colorScheme = $state<ColorSchemeNamesInput>('light');
  let pageBgLabel = $state('Default');
  let fontPresetLabel = $state('Blade default');
  let fontSizeScaleFactor = $state('1');

  let selectedStyleComponent = $state<CheckoutStyleComponent>('Button');
  let styleOverridesEnabled = $state(false);
  let slotClassByComponent = $state(createInitialCheckoutSlotClasses());
  let cssVarValues = $state<Record<string, string>>({ ...CHECKOUT_INITIAL_CSS_VAR_VALUES });
  let appliedSlotClassByComponent = $state(createInitialCheckoutSlotClasses());
  let appliedCssVarValues = $state<Record<string, string>>({
    ...CHECKOUT_INITIAL_CSS_VAR_VALUES,
  });

  const themeBundle = $derived(
    buildThemeBundle({
      brandLabel,
      customBrandColor,
      radiusPreset,
      radiusOverride,
      colorScheme,
      pageBgLabel,
      fontPresetLabel,
      fontSizeScaleFactor,
    }),
  );
  const themeTokens = $derived(themeBundle.themeTokens);
  const fontFaceCSS = $derived(themeBundle.fontFaceCSS);

  const appliedCssVarsForPreview = $derived.by((): string[] => {
    const used = new Set<string>();
    const order: string[] = [];
    for (const component of CHECKOUT_STYLE_COMPONENTS) {
      for (const slot of CHECKOUT_SLOT_CATALOG[component].slots) {
        for (const varName of collectCssVarsFromClassNames(
          appliedSlotClassByComponent[component][slot] ?? '',
        )) {
          if (!used.has(varName)) {
            used.add(varName);
            order.push(varName);
          }
        }
      }
    }
    return order;
  });

  const buttonStyleOverride = $derived(
    styleOverridesEnabled
      ? (resolveStyleOverride(appliedSlotClassByComponent.Button) as StyleOverride<ButtonSlot>)
      : undefined,
  );
  const appBarLeadingStyleOverride = $derived(
    styleOverridesEnabled
      ? (resolveStyleOverride(
          appliedSlotClassByComponent.AppBarLeading,
        ) as StyleOverride<AppBarLeadingSlot>)
      : undefined,
  );
  const cardStyleOverride = $derived(
    styleOverridesEnabled
      ? (resolveStyleOverride(appliedSlotClassByComponent.Card) as StyleOverride<CardSlot>)
      : undefined,
  );

  const previewVarsStyle = $derived(
    styleOverridesEnabled
      ? buildPreviewVarsStyle(appliedCssVarValues, appliedCssVarsForPreview)
      : '',
  );
  const appBarSurfaceStyle = 'background-color: var(--surface-background-primary-intense);';

  const dynamicUtilityCss = $derived(
    styleOverridesEnabled
      ? buildDynamicUtilityCss(appliedSlotClassByComponent, appliedCssVarValues)
      : '',
  );

  let utilityStyleHost = $state<HTMLDivElement | undefined>(undefined);

  $effect(() => {
    const host = utilityStyleHost;
    if (!host) {
      return;
    }

    let styleEl = host.querySelector<HTMLStyleElement>('style[data-checkout-playground-utilities]');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('data-checkout-playground-utilities', '');
      host.appendChild(styleEl);
    }
    styleEl.textContent = dynamicUtilityCss;
  });

  function cloneSlotClasses(
    source: Record<CheckoutStyleComponent, Record<string, string>>,
  ): Record<CheckoutStyleComponent, Record<string, string>> {
    return Object.fromEntries(
      CHECKOUT_STYLE_COMPONENTS.map((name) => [name, { ...source[name] }]),
    ) as Record<CheckoutStyleComponent, Record<string, string>>;
  }

  function applyStyleOverrides(): void {
    appliedSlotClassByComponent = cloneSlotClasses(slotClassByComponent);
    appliedCssVarValues = { ...cssVarValues };
    styleOverridesEnabled = true;
  }
</script>

<div bind:this={utilityStyleHost} hidden aria-hidden="true"></div>

<!-- Studio chrome stays on the default theme so the preview owns the themed surface. -->
<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  <div class="studio-shell">
    <div class="studio-body">
      <main class="studio-canvas">
        <div class="studio-canvas-stage">
          <div class="studio-frame-chip">
            <span class="studio-frame-chip-glyph" aria-hidden="true"></span>
            <Text size="small" weight="medium">Payment Page</Text>
          </div>
          <div class="studio-frame">
            <BladeProvider {themeTokens} {colorScheme} {fontFaceCSS}>
              <CheckoutPreview
                {buttonStyleOverride}
                {appBarLeadingStyleOverride}
                {cardStyleOverride}
                {previewVarsStyle}
                {appBarSurfaceStyle}
              />
            </BladeProvider>
          </div>
        </div>
      </main>

      <StudioPanel
        bind:brandLabel
        bind:customBrandColor
        bind:pageBgLabel
        bind:fontPresetLabel
        bind:fontSizeScaleFactor
        bind:radiusPreset
        bind:radiusOverride
        bind:colorScheme
        bind:selectedStyleComponent
        bind:slotClassByComponent
        bind:cssVarValues
        bind:styleOverridesEnabled
        onApplyStyleOverrides={applyStyleOverrides}
      />
    </div>
  </div>
</BladeProvider>

<style>
  .studio-shell {
    height: 100vh;
    width: 100%;
    background-color: var(--surface-background-gray-subtle);
  }

  .studio-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    height: 100%;
    min-height: 0;
  }

  .studio-canvas {
    display: flex;
    justify-content: center;
    min-height: 0;
    padding: var(--spacing-8) var(--spacing-7);
    overflow: auto;
    background-color: var(--surface-background-gray-subtle);
  }

  /* Matches CheckoutPreview iPhone 13 outer frame (390×844 screen + 10px bezel). */
  .studio-canvas-stage {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    align-items: stretch;
    width: 410px;
    height: fit-content;
    flex-shrink: 0;
  }

  .studio-frame-chip {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: var(--spacing-2);
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-small);
    background-color: var(--surface-background-gray-intense);
  }

  .studio-frame-chip-glyph {
    width: 10px;
    height: 12px;
    border: 1px solid var(--surface-icon-gray-muted);
    border-radius: 2px;
  }

  .studio-frame {
    width: 100%;
  }

  /* BladeProvider renders a plain wrapper div; stretch it so the frame can size. */
  .studio-frame :global([data-blade-provider]) {
    width: 100%;
  }

  /*
   * `bg-(--brand-bg)` and `card-brand-border` are slot classnames typed into the
   * panel, so their rules must live outside the generated utility stylesheet.
   * Both remap Blade interactive tokens instead of setting a single property, so
   * hover/disabled states stay consistent with the picked brand color.
   */
  :global(.bg-\(--brand-bg\)) {
    --interactive-background-primary-default: var(--brand-bg);
    --interactive-background-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
    --interactive-background-primary-disabled: color-mix(in srgb, var(--brand-bg) 18%, transparent);
    --interactive-border-primary-default: var(--brand-bg);
    --interactive-border-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
    background-image: none;
  }

  :global(.card-brand-border) {
    --interactive-border-gray-disabled: var(--demo-card-border);
  }

  @media (max-width: 900px) {
    .studio-shell {
      height: auto;
      min-height: 100vh;
    }

    .studio-body {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
