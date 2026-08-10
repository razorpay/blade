<script lang="ts">
  import type {
    AppBarLeadingSlot,
    ButtonSlot,
    CardSlot,
    StyleOverride,
  } from '@razorpay/blade-core/styles';
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import BladeProvider from './BladeProvider.svelte';
  import CheckoutPreview from './CheckoutPreview.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Chip from '../Chip/Chip.svelte';
  import ChipGroup from '../Chip/ChipGroup.svelte';
  import SegmentedControl from '../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../SegmentedControl/SegmentedControlItem.svelte';
  import TextInput from '../Input/TextInput/TextInput.svelte';
  import Switch from '../Switch/Switch.svelte';
  import {
    BRAND_PRESETS,
    FONT_PRESETS,
    PAGE_BG_PRESETS,
    RADIUS_KEYS,
    RADIUS_PRESETS,
    type RadiusKey,
    buildThemeBundle,
    buildUsageSnippet,
    getBorderRadius,
    usesCreateTheme,
  } from './checkoutPlaygroundTheme';
  import {
    CHECKOUT_DEFAULT_SLOT_CLASSES,
    CHECKOUT_INITIAL_CSS_VAR_VALUES,
    CHECKOUT_SLOT_CATALOG,
    CHECKOUT_STYLE_COMPONENTS,
    buildDynamicUtilityCss,
    buildPreviewVarsStyle,
    collectActiveCssVars,
    collectCssVarsFromClassNames,
    createInitialCheckoutSlotClasses,
    defaultCssVarValue,
    isCheckoutStyleComponent,
    resolveStyleOverride,
    type CheckoutStyleComponent,
  } from './checkoutPlaygroundStyleOverride';

  let brandLabel = $state('Razorpay');
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

  const themeState = $derived({
    brandLabel,
    radiusPreset,
    radiusOverride,
    colorScheme,
    pageBgLabel,
    fontPresetLabel,
    fontSizeScaleFactor,
  });

  const brandHex = $derived(BRAND_PRESETS.find((b) => b.label === brandLabel)?.hex ?? '');
  const borderRadius = $derived(getBorderRadius(themeState));
  const pageBackground = $derived(
    PAGE_BG_PRESETS.find((p) => p.label === pageBgLabel)?.color ?? '',
  );
  const themeBundle = $derived(buildThemeBundle(themeState));
  const themeTokens = $derived(themeBundle.themeTokens);
  const fontFaceCSS = $derived(themeBundle.fontFaceCSS);
  const usageSnippet = $derived(buildUsageSnippet(themeState));

  const brandDisplay = $derived(brandHex || 'bladeTheme (default)');
  const radiusLabel = $derived(
    RADIUS_KEYS.map((key) => `${key} ${borderRadius[key]}px`).join(' · '),
  );

  const styleCatalog = $derived(CHECKOUT_SLOT_CATALOG[selectedStyleComponent]);
  const styleSlotClasses = $derived(slotClassByComponent[selectedStyleComponent]);
  const activeCssVars = $derived(collectActiveCssVars(slotClassByComponent, selectedStyleComponent));

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

  const styleOverrideSnippet = $derived.by((): string => {
    const override = resolveStyleOverride(styleSlotClasses);
    const keys = Object.keys(override);
    if (keys.length === 0) {
      return 'styleOverride={undefined}';
    }
    const props = keys.map((key) => `${key}: '${override[key]}'`).join(', ');
    return `styleOverride={{ ${props} }}`;
  });

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

  function onBrandChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next) brandLabel = next;
  }

  function onRadiusChange(payload: { name?: string; value: string }): void {
    if (payload.value in RADIUS_PRESETS) {
      radiusOverride = null;
      radiusPreset = payload.value;
    }
  }

  function onSchemeChange(payload: { name?: string; value: string }): void {
    if (
      payload.value === 'light' ||
      payload.value === 'dark' ||
      payload.value === 'system'
    ) {
      colorScheme = payload.value;
    }
  }

  function onPageBgChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next) pageBgLabel = next;
  }

  function onFontPresetChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next) fontPresetLabel = next;
  }

  function onFontScaleChange(payload: { name?: string; value: string }): void {
    fontSizeScaleFactor = payload.value;
  }

  function bumpRadius(delta: number): void {
    radiusOverride = Object.fromEntries(
      RADIUS_KEYS.map((key) => [
        key,
        Math.max(0, Math.min(48, borderRadius[key] + delta)),
      ]),
    ) as Record<RadiusKey, number>;
  }

  function setRadiusValue(key: RadiusKey, value: string): void {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    radiusOverride = {
      ...borderRadius,
      [key]: Math.max(0, Math.min(48, parsed)),
    };
  }

  function onStyleComponentChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next && isCheckoutStyleComponent(next)) {
      selectedStyleComponent = next;
    }
  }

  function updateStyleSlotClass(slot: string, value: string): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedStyleComponent]: {
        ...slotClassByComponent[selectedStyleComponent],
        [slot]: value,
      },
    };
  }

  function resetStyleSlotClasses(): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedStyleComponent]: { ...CHECKOUT_DEFAULT_SLOT_CLASSES[selectedStyleComponent] },
    };
  }

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

  function onStyleOverridesToggle(payload: { isChecked: boolean }): void {
    if (payload.isChecked) {
      applyStyleOverrides();
      return;
    }
    styleOverridesEnabled = false;
  }

  function getCssVarValue(varName: string): string {
    return cssVarValues[varName] ?? defaultCssVarValue(varName);
  }

  function setCssVarValue(varName: string, value: string): void {
    cssVarValues = { ...cssVarValues, [varName]: value };
  }
</script>

<div bind:this={utilityStyleHost} hidden aria-hidden="true"></div>

<BladeProvider {themeTokens} {colorScheme} {fontFaceCSS}>
  <div class="playground-layout">
    <aside class="controls-panel">
      <Heading size="large" weight="semibold">Checkout playground</Heading>
      <Text size="medium" color="surface.text.gray.muted">
        Tune global theme via <Code size="small">createTheme</Code> (live preview) and checkout
        <Code size="small">styleOverride</Code> slots (Apply to preview).
      </Text>

      <div class="meta">
        <Badge color="primary" emphasis="subtle">brand: {brandDisplay}</Badge>
        <Badge color="notice" emphasis="subtle">radius: {radiusLabel}</Badge>
        <Badge color="neutral" emphasis="subtle">scheme: {colorScheme}</Badge>
        {#if pageBackground}
          <Badge color="positive" emphasis="subtle">page bg: {pageBackground}</Badge>
        {/if}
        {#if usesCreateTheme(themeState)}
          <Badge color="information" emphasis="subtle">createTheme active</Badge>
        {/if}
      </div>

      <section class="control-section">
        <Heading size="small" weight="semibold">Global theme</Heading>

        <div class="control-block">
          <Text size="small" weight="semibold">Usage</Text>
          <pre class="usage-snippet"><code>{usageSnippet}</code></pre>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Brand</Text>
          <ChipGroup
            accessibilityLabel="Brand color"
            selectionType="single"
            size="small"
            value={brandLabel}
            onChange={onBrandChange}
          >
            {#each BRAND_PRESETS as preset (preset.label)}
              <Chip value={preset.label}>{preset.label}</Chip>
            {/each}
          </ChipGroup>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Page background (surface)</Text>
          <ChipGroup
            accessibilityLabel="Page background color"
            selectionType="single"
            size="small"
            value={pageBgLabel}
            onChange={onPageBgChange}
          >
            {#each PAGE_BG_PRESETS as preset (preset.label)}
              <Chip value={preset.label}>{preset.label}</Chip>
            {/each}
          </ChipGroup>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Font family</Text>
          <ChipGroup
            accessibilityLabel="Font family preset"
            selectionType="single"
            size="small"
            value={fontPresetLabel}
            onChange={onFontPresetChange}
          >
            {#each FONT_PRESETS as preset (preset.label)}
              <Chip value={preset.label}>{preset.label}</Chip>
            {/each}
          </ChipGroup>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Font size scale</Text>
          <SegmentedControl
            accessibilityLabel="Font size scale factor"
            size="small"
            value={fontSizeScaleFactor}
            onChange={onFontScaleChange}
          >
            <SegmentedControlItem value="0.9">0.9×</SegmentedControlItem>
            <SegmentedControlItem value="1">1×</SegmentedControlItem>
            <SegmentedControlItem value="1.1">1.1×</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Border radius</Text>
          <SegmentedControl
            accessibilityLabel="Border radius preset"
            size="small"
            value={radiusPreset}
            onChange={onRadiusChange}
          >
            <SegmentedControlItem value="default">Default</SegmentedControlItem>
            <SegmentedControlItem value="soft">Soft</SegmentedControlItem>
            <SegmentedControlItem value="round">Round</SegmentedControlItem>
            <SegmentedControlItem value="sharp">Sharp</SegmentedControlItem>
          </SegmentedControl>
          <div class="actions">
            <Button variant="tertiary" size="small" onClick={() => bumpRadius(-2)}>Radius −</Button>
            <Button variant="tertiary" size="small" onClick={() => bumpRadius(2)}>Radius +</Button>
          </div>
          <div class="radius-input-grid">
            {#each RADIUS_KEYS as key (key)}
              <label class="radius-input">
                <Text size="small" weight="medium">{key}</Text>
                <input
                  type="number"
                  min="0"
                  max="48"
                  value={borderRadius[key]}
                  aria-label="Border radius {key} in pixels"
                  oninput={(event) => setRadiusValue(key, event.currentTarget.value)}
                />
                <Text size="small" color="surface.text.gray.muted">px</Text>
              </label>
            {/each}
          </div>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Color scheme</Text>
          <SegmentedControl
            accessibilityLabel="Color scheme"
            size="small"
            value={colorScheme}
            onChange={onSchemeChange}
          >
            <SegmentedControlItem value="light">Light</SegmentedControlItem>
            <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
            <SegmentedControlItem value="system">System</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </section>

      <section class="control-section">
        <Heading size="small" weight="semibold">styleOverride (checkout)</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Button, AppBarLeading, Card. Edit slots below, then Apply to update the phone preview.
        </Text>

        <div class="control-block apply-row">
          <Switch
            isChecked={styleOverridesEnabled}
            onChange={onStyleOverridesToggle}
            accessibilityLabel="Apply style overrides to preview"
            size="small"
          />
          <Text size="small" weight="medium">Apply to preview</Text>
          <Button variant="secondary" size="small" onClick={applyStyleOverrides}>Apply</Button>
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Component</Text>
          <ChipGroup
            accessibilityLabel="Style override component"
            selectionType="single"
            size="small"
            value={selectedStyleComponent}
            onChange={onStyleComponentChange}
          >
            {#each CHECKOUT_STYLE_COMPONENTS as name (name)}
              <Chip value={name}>{name}</Chip>
            {/each}
          </ChipGroup>
        </div>

        <div class="control-block slot-grid">
          <div class="slot-grid-header">
            <Text size="small" weight="semibold">Slots ({selectedStyleComponent})</Text>
            <Button variant="tertiary" size="small" onClick={resetStyleSlotClasses}>Reset</Button>
          </div>
          {#each styleCatalog.slots as slot (slot)}
            {@const slotClassNames = styleSlotClasses[slot] ?? ''}
            <div class="slot-field">
              <Text size="small" weight="medium">{slot}</Text>
              <TextInput
                size="medium"
                accessibilityLabel="{selectedStyleComponent} · {slot} · classname"
                value={slotClassNames}
                placeholder="utility or global class"
                onChange={({ value }) => updateStyleSlotClass(slot, value ?? '')}
              />
            </div>
          {/each}
        </div>

        <div class="control-block">
          <Text size="small" weight="semibold">Resolved prop</Text>
          <Code size="small" isHighlighted={false}>{styleOverrideSnippet}</Code>
        </div>

        {#if activeCssVars.length > 0}
          <div class="control-block">
            <Text size="small" weight="semibold">CSS variables</Text>
            <div class="css-var-grid">
              {#each activeCssVars as varName (varName)}
                <label class="css-var-row">
                  <Text size="small" weight="medium">{varName}</Text>
                  <input
                    type="color"
                    value={getCssVarValue(varName)}
                    aria-label="{selectedStyleComponent} · {varName}"
                    oninput={(event) => setCssVarValue(varName, event.currentTarget.value)}
                  />
                  <Text size="small" color="surface.text.gray.muted">{getCssVarValue(varName)}</Text>
                </label>
              {/each}
            </div>
          </div>
        {/if}
      </section>
    </aside>

    <main class="preview-panel">
      <CheckoutPreview
        {buttonStyleOverride}
        appBarLeadingStyleOverride={appBarLeadingStyleOverride}
        cardStyleOverride={cardStyleOverride}
        {previewVarsStyle}
        {appBarSurfaceStyle}
      />
    </main>
  </div>
</BladeProvider>

<style>
  .playground-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    min-height: 100vh;
    width: 100%;
    background-color: var(--surface-background-gray-moderate);
  }

  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-6);
    overflow: auto;
    border-right: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-subtle);
  }

  .preview-panel {
    min-height: 100vh;
    overflow: auto;
  }

  .control-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    padding-top: var(--spacing-2);
    border-top: 1px solid var(--surface-border-gray-muted);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .control-block {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .usage-snippet {
    margin: 0;
    padding: var(--spacing-4);
    overflow-x: auto;
    background-color: var(--surface-background-gray-intense);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: var(--line-height-100);
    color: var(--surface-text-gray-normal);
    white-space: pre;
  }

  .usage-snippet code {
    font-family: inherit;
    font-size: inherit;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .radius-input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: var(--spacing-3);
    width: 100%;
  }

  .radius-input,
  .css-var-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
  }

  .radius-input input {
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-2) var(--spacing-3);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    background-color: var(--surface-background-gray-intense);
    color: var(--surface-text-gray-normal);
  }

  .apply-row {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .slot-grid-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .slot-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  }

  .css-var-grid {
    display: grid;
    gap: var(--spacing-3);
  }

  @media (max-width: 960px) {
    .playground-layout {
      grid-template-columns: 1fr;
    }

    .controls-panel {
      border-right: none;
      border-bottom: 1px solid var(--surface-border-gray-muted);
    }
  }
</style>
