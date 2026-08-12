<script lang="ts">
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import Badge from '../../../../Badge/Badge.svelte';
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
    CHECKOUT_COMPONENT_NOTES,
    CHECKOUT_STYLE_COMPONENTS,
    isCheckoutStyleComponent,
    type CheckoutStyleComponent,
  } from '../checkoutPlaygroundStyleOverride';
  import SnippetTabs from '../../styleOverride/SnippetTabs.svelte';
  import Switch from '../../../../Switch/Switch.svelte';
  import {
    LENGTH_CSS_VARS,
    collectCssVarsForComponents,
    getCssVarValue as readCssVar,
    getSlotMeta,
    type SlotClassMap,
  } from '../../styleOverride/styleOverrideEngine';

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
    isStyleOverrideApplied = $bindable(),
    onRadiusPulse,
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
    slotClassByComponent: Record<CheckoutStyleComponent, SlotClassMap>;
    cssVarValues: Record<string, string>;
    isStyleOverrideApplied: boolean;
    /** Locate helper: pulse every preview element bound to these radius tokens after an edit. */
    onRadiusPulse?: (keys: RadiusKey[]) => void;
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

  const styleSlotMeta = $derived(getSlotMeta(selectedStyleComponent));
  const styleSlotClasses = $derived(slotClassByComponent[selectedStyleComponent]);
  const activeCssVars = $derived(
    collectCssVarsForComponents(slotClassByComponent, [selectedStyleComponent]),
  );
  const componentNote = $derived(CHECKOUT_COMPONENT_NOTES[selectedStyleComponent]);

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
      onRadiusPulse?.(RADIUS_KEYS);
    }
  }

  function setRadiusValue(key: RadiusKey, value: number): void {
    radiusOverride = { ...borderRadius, [key]: value };
    onRadiusPulse?.([key]);
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

  function getCssVarValue(varName: string): string {
    return readCssVar(cssVarValues, varName);
  }

  function setCssVarValue(varName: string, value: string): void {
    cssVarValues = { ...cssVarValues, [varName]: value };
  }

  function getCssVarLength(varName: string): number {
    const parsed = Number.parseFloat(getCssVarValue(varName));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function setCssVarLength(varName: string, px: number): void {
    setCssVarValue(varName, `${Math.max(0, Number.isFinite(px) ? px : 0)}px`);
  }
</script>

<aside class="studio-panel">
  <div class="studio-panel-header">
    <Text size="medium" weight="semibold">Customisations</Text>
  </div>

  <Tabs defaultValue="foundations" size="small" variant="bordered">
    <div class="studio-panel-tabbar">
      <TabList>
        <TabItem value="foundations">Foundations</TabItem>
        <TabItem value="widgets">Overrides</TabItem>
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
        <Text size="xsmall" color="surface.text.gray.muted">
          Editing a radius flashes affected elements in the preview. Overlays (sheets, menus) update
          too — open one within a few seconds of editing to see it flash.
        </Text>
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
          Foundations change the whole system; styleOverride patches component's slots.
        </Text>
        <div class="studio-apply">
          <Switch
            id="studio-style-apply"
            size="small"
            isChecked={isStyleOverrideApplied}
            accessibilityLabel="Apply styleOverride to the checkout"
            onChange={({ isChecked }) => (isStyleOverrideApplied = isChecked)}
          />
          <label for="studio-style-apply" class="studio-apply-label">
            <Text size="small" color="surface.text.gray.muted">
              {isStyleOverrideApplied ? 'styleOverride applied' : 'Apply styleOverride'}
            </Text>
          </label>
        </div>
        <StudioField label="Component" controlId="studio-style-component">
          <StudioSelect
            id="studio-style-component"
            value={selectedStyleComponent}
            options={componentOptions}
            onChange={setStyleComponent}
          />
        </StudioField>
        {#if componentNote}
          <Text size="xsmall" color="surface.text.notice.subtle">{componentNote}</Text>
        {/if}
      </StudioSection>

      <StudioSection title="{selectedStyleComponent} slots">
        <Text size="small" color="surface.text.gray.muted">
        The inputs are pre-filled; flip Apply to push them onto the checkout preview.
        </Text>
        {#each styleSlotMeta.slots as slot (slot.name)}
          <StudioField label={slot.name}>
            <TextInput
              size="small"
              accessibilityLabel="{selectedStyleComponent} {slot.name} classname"
              value={styleSlotClasses[slot.name] ?? ''}
              placeholder="utility or global class"
              onChange={({ value }) => updateSlotClass(slot.name, value ?? '')}
            />
          </StudioField>
        {/each}
      </StudioSection>

      {#if activeCssVars.length > 0}
        <StudioSection title="Demo variables" defaultIsExpanded={false}>
          <Text size="xsmall" color="surface.text.gray.muted">
            Scaffolding for this playground, not part of the styleOverride API — the seeded
            classnames happen to read these variables.
          </Text>
          {#each activeCssVars as varName (varName)}
            <StudioField label={varName} controlId="studio-var-{varName}">
              {#if LENGTH_CSS_VARS.has(varName)}
                <div class="studio-readout">
                  <input
                    id="studio-var-{varName}"
                    class="studio-length-input"
                    type="number"
                    min="0"
                    max="48"
                    step="1"
                    value={getCssVarLength(varName)}
                    oninput={(event) => setCssVarLength(varName, event.currentTarget.valueAsNumber)}
                  />
                  <Text size="small">{getCssVarValue(varName)}</Text>
                </div>
              {:else}
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
              {/if}
            </StudioField>
          {/each}
        </StudioSection>
      {/if}

      <StudioSection title="Code Snippet">
        <SnippetTabs
          component={selectedStyleComponent}
          components={CHECKOUT_STYLE_COMPONENTS}
          slotClassesByComponent={slotClassByComponent}
          {cssVarValues}
          availableForms={['instance']}
        />
      </StudioSection>
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
    padding: var(--spacing-7) var(--spacing-7) 0;
    /* border-bottom: 1px solid var(--surface-border-gray-muted); */
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

  .studio-length-input {
    flex-shrink: 0;
    box-sizing: border-box;
    width: 64px;
    height: 24px;
    padding: 0 var(--spacing-2);
    border: 1px solid var(--surface-border-gray-subtle);
    border-radius: var(--border-radius-xsmall);
    background-color: var(--surface-background-gray-intense);
    color: var(--surface-text-gray-normal);
    font-family: var(--font-family-code);
    font-size: var(--font-size-25);
  }

  .studio-apply {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .studio-apply-label {
    cursor: pointer;
    user-select: none;
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
