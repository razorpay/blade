<script lang="ts">
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import Badge from '../../../../Badge/Badge.svelte';
  import Button from '../../../../Button/Button.svelte';
  import SegmentedControl from '../../../../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../../../../SegmentedControl/SegmentedControlItem.svelte';
  import Tabs from '../../../../Tabs/Tabs.svelte';
  import TabList from '../../../../Tabs/TabList.svelte';
  import TabItem from '../../../../Tabs/TabItem.svelte';
  import TabPanel from '../../../../Tabs/TabPanel.svelte';
  import Text from '../../../../Typography/Text/Text.svelte';
  import TextInput from '../../../../Input/TextInput/TextInput.svelte';
  import StudioField from './StudioField.svelte';
  import StudioSection from './StudioSection.svelte';
  import StudioSelect from './StudioSelect.svelte';
  import StudioSlider from './StudioSlider.svelte';
  import {
    BRAND_PRESETS,
    CUSTOM_BRAND_LABEL,
    DEFAULT_CUSTOM_BRAND_COLOR,
    FONT_PRESETS,
    PAGE_BG_PRESETS,
    RADIUS_KEYS,
    RADIUS_PRESETS,
    type RadiusKey,
    buildUsageSnippet,
    getBorderRadius,
    resolveBrandHex,
    usesCreateTheme,
  } from '../checkoutPlaygroundTheme';
  import {
    CHECKOUT_DEFAULT_SLOT_CLASSES,
    CHECKOUT_SLOT_CATALOG,
    CHECKOUT_STYLE_COMPONENTS,
    collectActiveCssVars,
    defaultCssVarValue,
    isCheckoutStyleComponent,
    resolveStyleOverride,
    type CheckoutStyleComponent,
  } from '../checkoutPlaygroundStyleOverride';

  let {
    brandLabel = $bindable(),
    customBrandColor = $bindable(DEFAULT_CUSTOM_BRAND_COLOR),
    pageBgLabel = $bindable(),
    fontPresetLabel = $bindable(),
    fontSizeScaleFactor = $bindable(),
    radiusPreset = $bindable(),
    radiusOverride = $bindable(),
    colorScheme = $bindable(),
    selectedStyleComponent = $bindable(),
    slotClassByComponent = $bindable(),
    cssVarValues = $bindable(),
    styleOverridesEnabled = $bindable(),
    onApplyStyleOverrides,
  }: {
    brandLabel: string;
    customBrandColor: string;
    pageBgLabel: string;
    fontPresetLabel: string;
    fontSizeScaleFactor: string;
    radiusPreset: string;
    radiusOverride: Record<RadiusKey, number> | null;
    colorScheme: ColorSchemeNamesInput;
    selectedStyleComponent: CheckoutStyleComponent;
    slotClassByComponent: Record<CheckoutStyleComponent, Record<string, string>>;
    cssVarValues: Record<string, string>;
    styleOverridesEnabled: boolean;
    onApplyStyleOverrides: () => void;
  } = $props();

  const RADIUS_PRESET_OPTIONS = Object.keys(RADIUS_PRESETS).map((preset) => ({
    value: preset,
    label: `${preset[0].toUpperCase()}${preset.slice(1)}`,
  }));

  const FONT_SCALE_OPTIONS = [
    { value: '0.9', label: '0.9× Compact' },
    { value: '1', label: '1× Default' },
    { value: '1.1', label: '1.1× Relaxed' },
  ];

  const COLOR_SCHEME_OPTIONS = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const toOptions = (labels: string[]): { label: string; value: string }[] =>
    labels.map((label) => ({ label, value: label }));

  const brandOptions = toOptions(BRAND_PRESETS.map((preset) => preset.label));
  const pageBgOptions = toOptions(PAGE_BG_PRESETS.map((preset) => preset.label));
  const fontOptions = toOptions(FONT_PRESETS.map((preset) => preset.label));
  const componentOptions = toOptions([...CHECKOUT_STYLE_COMPONENTS]);

  const themeState = $derived({
    brandLabel,
    customBrandColor,
    radiusPreset,
    radiusOverride,
    colorScheme,
    pageBgLabel,
    fontPresetLabel,
    fontSizeScaleFactor,
  });

  const isCustomBrand = $derived(brandLabel === CUSTOM_BRAND_LABEL);
  const brandHex = $derived(resolveBrandHex(themeState));
  const pageBackground = $derived(
    PAGE_BG_PRESETS.find((preset) => preset.label === pageBgLabel)?.color ?? '',
  );
  const borderRadius = $derived(getBorderRadius(themeState));
  const usageSnippet = $derived(buildUsageSnippet(themeState));
  const isThemed = $derived(usesCreateTheme(themeState));

  const styleCatalog = $derived(CHECKOUT_SLOT_CATALOG[selectedStyleComponent]);
  const styleSlotClasses = $derived(slotClassByComponent[selectedStyleComponent]);
  const activeCssVars = $derived(collectActiveCssVars(slotClassByComponent, selectedStyleComponent));

  const styleOverrideSnippet = $derived.by((): string => {
    const override = resolveStyleOverride(styleSlotClasses);
    const keys = Object.keys(override);
    if (keys.length === 0) {
      return 'styleOverride={undefined}';
    }
    return `styleOverride={{ ${keys.map((key) => `${key}: '${override[key]}'`).join(', ')} }}`;
  });

  function setBrandLabel(value: string): void {
    if (value === CUSTOM_BRAND_LABEL) {
      const previousHex = BRAND_PRESETS.find((preset) => preset.label === brandLabel)?.hex;
      if (previousHex) {
        customBrandColor = previousHex;
      }
    }
    brandLabel = value;
  }

  function setCustomBrandColor(value: string): void {
    customBrandColor = value;
  }

  function setRadiusPreset(preset: string): void {
    if (preset in RADIUS_PRESETS) {
      radiusOverride = null;
      radiusPreset = preset;
    }
  }

  function setRadiusValue(key: RadiusKey, value: number): void {
    radiusOverride = { ...borderRadius, [key]: value };
  }

  function setColorScheme(value: string): void {
    if (value === 'light' || value === 'dark' || value === 'system') {
      colorScheme = value;
    }
  }

  function setStyleComponent(value: string): void {
    if (isCheckoutStyleComponent(value)) {
      selectedStyleComponent = value;
    }
  }

  function updateSlotClass(slot: string, value: string): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedStyleComponent]: {
        ...slotClassByComponent[selectedStyleComponent],
        [slot]: value,
      },
    };
  }

  function resetSlotClasses(): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedStyleComponent]: { ...CHECKOUT_DEFAULT_SLOT_CLASSES[selectedStyleComponent] },
    };
  }

  function getCssVarValue(varName: string): string {
    return cssVarValues[varName] ?? defaultCssVarValue(varName);
  }

  function setCssVarValue(varName: string, value: string): void {
    cssVarValues = { ...cssVarValues, [varName]: value };
  }

  function toggleStyleOverrides(payload: { name?: string; value: string }): void {
    if (payload.value === 'on') {
      onApplyStyleOverrides();
      return;
    }
    styleOverridesEnabled = false;
  }
</script>

<aside class="studio-panel">
  <div class="studio-panel-header">
    <Text size="medium" weight="semibold">Payment Page</Text>
    {#if isThemed}
      <Badge color="information" emphasis="subtle" size="small">createTheme</Badge>
    {/if}
  </div>

  <Tabs defaultValue="foundations" size="small" variant="bordered" isFullWidthTabItem>
    <div class="studio-panel-tabbar">
      <TabList>
        <TabItem value="foundations">Foundations</TabItem>
        <TabItem value="widgets">Widgets</TabItem>
      </TabList>
    </div>

    <TabPanel value="foundations">
      <StudioSection title="Brand">
        <StudioField label="Preset" controlId="studio-brand">
          <StudioSelect
            id="studio-brand"
            value={brandLabel}
            options={brandOptions}
            onChange={setBrandLabel}
          />
        </StudioField>
        {#if isCustomBrand}
          <StudioField label="Brand color" controlId="studio-brand-color">
            <div class="studio-readout">
              <input
                id="studio-brand-color"
                class="studio-color-input"
                type="color"
                value={customBrandColor}
                oninput={(event) => setCustomBrandColor(event.currentTarget.value)}
              />
              <Text size="small">{customBrandColor}</Text>
            </div>
          </StudioField>
        {:else}
          <StudioField label="Brand color">
            <div class="studio-readout">
              <span
                class="studio-swatch"
                style="background-color: {brandHex || 'var(--surface-background-primary-intense)'};"
              ></span>
              <Text size="small">{brandHex || 'bladeTheme default'}</Text>
            </div>
          </StudioField>
        {/if}
      </StudioSection>

      <StudioSection title="Typography">
        <StudioField label="Font family" controlId="studio-font">
          <StudioSelect
            id="studio-font"
            value={fontPresetLabel}
            options={fontOptions}
            onChange={(value) => {
              fontPresetLabel = value;
            }}
          />
        </StudioField>
        <StudioField label="Text scale" controlId="studio-font-scale">
          <StudioSelect
            id="studio-font-scale"
            value={fontSizeScaleFactor}
            options={FONT_SCALE_OPTIONS}
            onChange={(value) => {
              fontSizeScaleFactor = value;
            }}
          />
        </StudioField>
      </StudioSection>

      <StudioSection title="Corner radius">
        <StudioField label="Preset" controlId="studio-radius-preset">
          <StudioSelect
            id="studio-radius-preset"
            value={radiusPreset}
            options={RADIUS_PRESET_OPTIONS}
            onChange={setRadiusPreset}
          />
        </StudioField>
        {#each RADIUS_KEYS as key (key)}
          <StudioField label={key} controlId="studio-radius-{key}">
            <StudioSlider
              id="studio-radius-{key}"
              value={borderRadius[key]}
              accessibilityLabel="Border radius {key}"
              onChange={(value) => setRadiusValue(key, value)}
            />
          </StudioField>
        {/each}
      </StudioSection>

      <StudioSection title="Surface">
        <StudioField label="Color scheme" controlId="studio-scheme">
          <StudioSelect
            id="studio-scheme"
            value={colorScheme}
            options={COLOR_SCHEME_OPTIONS}
            onChange={setColorScheme}
          />
        </StudioField>
        <StudioField label="Page background" controlId="studio-page-bg">
          <StudioSelect
            id="studio-page-bg"
            value={pageBgLabel}
            options={pageBgOptions}
            onChange={(value) => {
              pageBgLabel = value;
            }}
          />
        </StudioField>
        {#if pageBackground}
          <StudioField label="Resolved">
            <div class="studio-readout">
              <span class="studio-swatch" style="background-color: {pageBackground};"></span>
              <Text size="small">{pageBackground}</Text>
            </div>
          </StudioField>
        {/if}
      </StudioSection>

      <StudioSection title="Usage" defaultIsExpanded={false}>
        <pre class="studio-code"><code>{usageSnippet}</code></pre>
      </StudioSection>
    </TabPanel>

    <TabPanel value="widgets">
      <StudioSection title="Style override">
        <Text size="small" color="surface.text.gray.muted">
          Slot classnames for checkout components. Apply pushes them to the preview.
        </Text>
        <StudioField label="Apply">
          <SegmentedControl
            accessibilityLabel="Apply style overrides to preview"
            size="small"
            value={styleOverridesEnabled ? 'on' : 'off'}
            onChange={toggleStyleOverrides}
          >
            <SegmentedControlItem value="on">On</SegmentedControlItem>
            <SegmentedControlItem value="off">Off</SegmentedControlItem>
          </SegmentedControl>
        </StudioField>
        <StudioField label="Component" controlId="studio-style-component">
          <StudioSelect
            id="studio-style-component"
            value={selectedStyleComponent}
            options={componentOptions}
            onChange={setStyleComponent}
          />
        </StudioField>
      </StudioSection>

      <StudioSection title="{selectedStyleComponent} slots">
        {#each styleCatalog.slots as slot (slot)}
          <StudioField label={slot}>
            <TextInput
              size="small"
              accessibilityLabel="{selectedStyleComponent} {slot} classname"
              value={styleSlotClasses[slot] ?? ''}
              placeholder="utility or global class"
              onChange={({ value }) => updateSlotClass(slot, value ?? '')}
            />
          </StudioField>
        {/each}
        <div class="studio-actions">
          <Button variant="tertiary" size="small" onClick={resetSlotClasses}>Reset</Button>
          <Button variant="secondary" size="small" onClick={onApplyStyleOverrides}>
            Apply to preview
          </Button>
        </div>
        <pre class="studio-code"><code>{styleOverrideSnippet}</code></pre>
      </StudioSection>

      {#if activeCssVars.length > 0}
        <StudioSection title="CSS variables">
          {#each activeCssVars as varName (varName)}
            <StudioField label={varName} controlId="studio-var-{varName}">
              <div class="studio-readout">
                <input
                  id="studio-var-{varName}"
                  class="studio-color-input"
                  type="color"
                  value={getCssVarValue(varName)}
                  oninput={(event) => setCssVarValue(varName, event.currentTarget.value)}
                />
                <Text size="small">{getCssVarValue(varName)}</Text>
              </div>
            </StudioField>
          {/each}
        </StudioSection>
      {/if}
    </TabPanel>
  </Tabs>
</aside>

<style>
  .studio-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    border-left: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
  }

  .studio-panel-header {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
    padding: var(--spacing-4) var(--spacing-7);
    border-bottom: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
  }

  .studio-panel-tabbar {
    position: sticky;
    top: 45px;
    z-index: 1;
    padding: 0 var(--spacing-7);
    border-bottom: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
  }

  .studio-readout {
    display: flex;
    flex: 1;
    align-items: center;
    gap: var(--spacing-3);
    height: 32px;
    min-width: 0;
    padding: 0 var(--spacing-3);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-small);
    background-color: var(--surface-background-gray-intense);
    overflow: hidden;
  }

  .studio-swatch {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-xsmall);
  }

  .studio-color-input {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-xsmall);
    background: none;
    cursor: pointer;
  }

  .studio-color-input::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .studio-color-input::-webkit-color-swatch {
    border: none;
    border-radius: 2px;
  }

  .studio-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .studio-code {
    margin: 0;
    padding: var(--spacing-4);
    overflow-x: auto;
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-medium);
    background-color: var(--surface-background-gray-subtle);
    color: var(--surface-text-gray-subtle);
    font-family: var(--font-family-code);
    font-size: var(--font-size-25);
    line-height: var(--line-height-75);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .studio-code code {
    font-family: inherit;
    font-size: inherit;
  }
</style>
