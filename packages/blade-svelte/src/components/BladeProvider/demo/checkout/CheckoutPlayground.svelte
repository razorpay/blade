<script lang="ts">
  import type { StyleOverride } from '@razorpay/blade-core/styles';
  import { bladeTheme, type ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import BladeProvider from '../../BladeProvider.svelte';
  import type { BladeComponentConfigMap } from '../../types';
  import CheckoutPreview from './CheckoutPreview.svelte';
  import StudioPanel from './studio/StudioPanel.svelte';
  import {
    DEFAULT_CUSTOM_BRAND_COLOR,
    type RadiusKey,
    buildThemeBundle,
  } from './checkoutPlaygroundTheme';
  import {
    CHECKOUT_STYLE_COMPONENTS,
    createCheckoutCssVars,
    createCheckoutSlotClasses,
    type CheckoutStyleComponent,
  } from './checkoutPlaygroundStyleOverride';
  import {
    STATIC_SLOT_CLASS_CSS,
    buildDynamicCss,
    buildPreviewVarsStyle,
    collectCssVarsForComponents,
    mountDemoStylesheet,
    resolveStyleOverride,
    type SlotClassMap,
  } from '../styleOverride/styleOverrideEngine';

  let brandLabel = $state('Razorpay');
  let customBrandColor = $state(DEFAULT_CUSTOM_BRAND_COLOR);
  let radiusPreset = $state('default');
  let radiusOverride = $state<Record<RadiusKey, number> | null>(null);
  let colorScheme = $state<ColorSchemeNamesInput>('light');
  let pageBgLabel = $state('Default');
  let fontPresetLabel = $state('Blade default');
  let fontSizeScaleFactor = $state('1');

  // Radius "locate" helper: pulse = one-shot ring on every element bound to an edited radius
  // token. Preview matches by token (not px) so tokens that share a value don't cross-highlight.
  let pulseRadiusKeys = $state<RadiusKey[]>([]);
  let pulseNonce = $state(0);

  let selectedStyleComponent = $state<CheckoutStyleComponent>('Button');
  let isStyleOverrideApplied = $state(false);
  let slotClassByComponent = $state<Record<CheckoutStyleComponent, SlotClassMap>>(
    createCheckoutSlotClasses(),
  );
  let cssVarValues = $state(createCheckoutCssVars());

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

  const activeCssVars = $derived(
    collectCssVarsForComponents(slotClassByComponent, CHECKOUT_STYLE_COMPONENTS),
  );

  /**
   * Overrides stay off until Apply is toggled on, so the checkout loads on the baseline even with
   * the inputs pre-filled. Only the component picked in the dropdown gets patched — Apply never
   * touches the other components.
   */
  const overrideFor = (component: CheckoutStyleComponent): StyleOverride<string> | undefined =>
    !isStyleOverrideApplied || component !== selectedStyleComponent
      ? undefined
      : resolveStyleOverride(slotClassByComponent[component]);

  /**
   * Provider config rather than instance props: every component in the panel gets patched
   * wherever the checkout renders it, without threading a prop per component into the preview.
   */
  const componentConfig = $derived(
    Object.fromEntries(
      CHECKOUT_STYLE_COMPONENTS.map((component) => [
        component,
        { styleOverride: overrideFor(component) },
      ]),
    ) as BladeComponentConfigMap,
  );

  const previewVarsStyle = $derived(buildPreviewVarsStyle(cssVarValues, activeCssVars));
  const appBarSurfaceStyle = 'background-color: var(--surface-background-primary-intense);';

  /**
   * Accordion ignores `styleOverride` while `variant="filled"`, so flip the checkout's method
   * accordion to `transparent` exactly when it's the applied override target — that's the only
   * time its slot classes are pushed through the provider config.
   */
  const accordionVariant = $derived(
    isStyleOverrideApplied && selectedStyleComponent === 'Accordion' ? 'transparent' : 'filled',
  );

  const dynamicCss = $derived(
    buildDynamicCss(slotClassByComponent, CHECKOUT_STYLE_COMPONENTS, cssVarValues),
  );

  let styleHost = $state<HTMLDivElement | undefined>(undefined);

  $effect(() => {
    mountDemoStylesheet(
      styleHost,
      'data-checkout-playground-css',
      [STATIC_SLOT_CLASS_CSS, dynamicCss].filter(Boolean).join('\n\n'),
    );
  });
</script>

<div bind:this={styleHost} hidden aria-hidden="true"></div>

<!-- Studio chrome stays on the default theme so the preview owns the themed surface. -->
<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  <div class="studio-shell">
    <div class="studio-body">
      <main class="studio-canvas">
        <div class="studio-canvas-stage">
          <div class="studio-frame">
            <BladeProvider {themeTokens} {colorScheme} {fontFaceCSS} {componentConfig}>
              <CheckoutPreview
                {previewVarsStyle}
                {appBarSurfaceStyle}
                {pulseRadiusKeys}
                {pulseNonce}
                {accordionVariant}
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
        bind:isStyleOverrideApplied
        onRadiusPulse={(keys) => {
          pulseRadiusKeys = keys;
          pulseNonce += 1;
        }}
      />
    </div>
  </div>
</BladeProvider>

<style>
  .studio-shell {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    background-color: var(--surface-background-gray-subtle);
  }

  .studio-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }

  .studio-canvas {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 0;
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

  .studio-frame {
    width: 100%;
  }

  /* BladeProvider renders a plain wrapper div; stretch it so the frame can size. */
  .studio-frame :global([data-blade-provider]) {
    width: 100%;
  }

  @media (max-width: 900px) {
    .studio-body {
      grid-template-columns: minmax(0, 1fr);
      overflow: auto;
    }
  }
</style>
