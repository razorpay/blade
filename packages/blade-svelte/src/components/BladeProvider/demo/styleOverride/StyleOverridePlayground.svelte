<script lang="ts">
  import type {
    AccordionSlot,
    AmountSlot,
    AnnouncementBannerSlot,
    AppBarLeadingSlot,
    AvatarSlot,
    ButtonSlot,
    CardSlot,
    DividerSlot,
    HeadingSlot,
    IconButtonSlot,
    StyleOverride,
    TextSlot,
  } from '@razorpay/blade-core/styles';
  import Accordion from '../../../Accordion/Accordion.svelte';
  import AccordionItem from '../../../Accordion/AccordionItem.svelte';
  import AccordionItemBody from '../../../Accordion/AccordionItemBody.svelte';
  import AccordionItemHeader from '../../../Accordion/AccordionItemHeader.svelte';
  import Amount from '../../../Amount/Amount.svelte';
  import AnnouncementBanner from '../../../AnnouncementBanner/AnnouncementBanner.svelte';
  import AppBar from '../../../AppBar/AppBar.svelte';
  import Avatar from '../../../Avatar/Avatar.svelte';
  import AppBarLeading from '../../../AppBar/AppBarLeading.svelte';
  import AppBarActions from '../../../AppBar/AppBarActions.svelte';
  import Button from '../../../Button/Button.svelte';
  import Card from '../../../Card/Card.svelte';
  import Chip from '../../../Chip/Chip.svelte';
  import ChipGroup from '../../../Chip/ChipGroup.svelte';
  import Divider from '../../../Divider/Divider.svelte';
  import IconButton from '../../../Button/IconButton/IconButton.svelte';
  import TextInput from '../../../Input/TextInput/TextInput.svelte';
  import { InfoIcon, SearchIcon, UserIcon } from '../../../Icons';
  import Code from '../../../Typography/Code/Code.svelte';
  import Heading from '../../../Typography/Heading/Heading.svelte';
  import Text from '../../../Typography/Text/Text.svelte';
  import CompareButton from './CompareButton.svelte';
  import SnippetTabs from './SnippetTabs.svelte';
  import {
    LENGTH_CSS_VARS,
    STATIC_SLOT_CLASS_CSS,
    STYLE_OVERRIDE_COMPONENTS,
    buildDynamicCss,
    buildPreviewVarsStyle,
    collectCssVarsFromClassNames,
    getCssVarValue as readCssVar,
    getSlotMeta,
    isStyleOverrideComponent,
    mountDemoStylesheet,
    resolveStyleOverride,
    type SlotClassMap,
    type StyleOverrideComponent,
  } from './styleOverrideEngine';
  import {
    DEFAULT_PRESET_ID,
    getPresetCssVars,
    getPresetSlotClasses,
  } from './styleOverridePresets';

  const COMPONENT_OPTIONS = STYLE_OVERRIDE_COMPONENTS;
  /** The playground seeds from the signature look; presets are no longer surfaced. */
  const SEED_ID = DEFAULT_PRESET_ID;

  let selectedComponent = $state<StyleOverrideComponent>('Button');
  let isComparing = $state(false);
  let slotClassByComponent = $state<Record<StyleOverrideComponent, SlotClassMap>>(
    getPresetSlotClasses(SEED_ID, COMPONENT_OPTIONS),
  );
  let cssVarValues = $state(getPresetCssVars(SEED_ID));

  const slotMeta = $derived(getSlotMeta(selectedComponent));
  const slotClasses = $derived(slotClassByComponent[selectedComponent]);

  const styleOverride = $derived(resolveStyleOverride(slotClasses));
  /** Compare toggle drops the override so the baseline component shows through. */
  const previewStyleOverride = $derived(isComparing ? undefined : styleOverride);

  const typeSnippet = $derived(
    `type ${slotMeta.slotType} = ${slotMeta.slots.map((slot) => `'${slot.name}'`).join(' | ')};`,
  );

  const activeCssVars = $derived.by((): string[] => {
    const used = new Set<string>();
    const order: string[] = [];
    for (const slot of slotMeta.slots) {
      for (const varName of collectCssVarsFromClassNames(slotClasses[slot.name] ?? '')) {
        if (!used.has(varName)) {
          used.add(varName);
          order.push(varName);
        }
      }
    }
    return order;
  });

  const previewVarsStyle = $derived(buildPreviewVarsStyle(cssVarValues, activeCssVars));
  const dynamicCss = $derived(
    buildDynamicCss(slotClassByComponent, [selectedComponent], cssVarValues),
  );

  function getCssVarValue(varName: string): string {
    return readCssVar(cssVarValues, varName);
  }

  function setCssVarValue(varName: string, value: string): void {
    cssVarValues = { ...cssVarValues, [varName]: value };
  }

  function parseLengthPx(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function setLengthVarValue(varName: string, px: number): void {
    setCssVarValue(varName, `${Math.max(0, px)}px`);
  }

  /** Typing an unseeded variable still needs a value before its control can render. */
  function ensureCssVarsRegistered(varNames: readonly string[]): void {
    let next: Record<string, string> | null = null;
    for (const varName of varNames) {
      if (varName in cssVarValues) {
        continue;
      }
      next ??= { ...cssVarValues };
      next[varName] = readCssVar(cssVarValues, varName);
    }
    if (next) {
      cssVarValues = next;
    }
  }

  $effect(() => {
    ensureCssVarsRegistered(activeCssVars);
  });

  let styleHost = $state<HTMLDivElement | undefined>(undefined);

  $effect(() => {
    mountDemoStylesheet(
      styleHost,
      'data-style-override-playground-css',
      [STATIC_SLOT_CLASS_CSS, dynamicCss].filter(Boolean).join('\n\n'),
    );
  });

  function onComponentChange(payload: { name: string; values: string[] }): void {
    const next = payload.values[0];
    if (next && isStyleOverrideComponent(next)) {
      selectedComponent = next;
    }
  }

  function updateSlotClass(slot: string, value: string): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedComponent]: { ...slotClassByComponent[selectedComponent], [slot]: value },
    };
  }

  function resetSlotClasses(): void {
    slotClassByComponent = {
      ...slotClassByComponent,
      [selectedComponent]: getPresetSlotClasses(SEED_ID, [selectedComponent])[selectedComponent],
    };
  }
</script>

<div bind:this={styleHost} hidden aria-hidden="true"></div>

<div class="story-shell">
  <div class="playground">
    <header class="pg-header">
      <Heading size="large" weight="semibold">styleOverride slots</Heading>
      <Text size="medium" color="surface.text.gray.muted">
        See how <Code size="small">styleOverride</Code> restyles each component's slots. Pick a
        component, edit its slot classnames, and watch the preview update live.
      </Text>
    </header>

    <div class="pg-picker">
      <ChipGroup
        accessibilityLabel="Style override component"
        selectionType="single"
        size="small"
        value={selectedComponent}
        onChange={onComponentChange}
      >
        {#each COMPONENT_OPTIONS as name (name)}
          <Chip value={name}>{name}</Chip>
        {/each}
      </ChipGroup>
    </div>

    <div class="pg-body">
      <aside class="pg-controls">
        <section class="pg-card">
          <Text size="small" weight="semibold">Slots</Text>
          <pre class="type-snippet"><code>{typeSnippet}</code></pre>
        </section>

        <section class="pg-card">
          <div class="pg-card-header">
            <Text size="small" weight="semibold">Classnames</Text>
            <Button variant="tertiary" size="small" onClick={resetSlotClasses}>Reset</Button>
          </div>
          <div class="slot-list">
            {#each slotMeta.slots as slot (slot.name)}
              {@const slotClassNames = slotClasses[slot.name] ?? ''}
              {@const slotCssVars = collectCssVarsFromClassNames(slotClassNames)}
              <div class="slot-field">
                <Text size="xsmall" weight="medium" color="surface.text.gray.muted">
                  {slot.name}
                </Text>
                <TextInput
                  size="small"
                  accessibilityLabel="{selectedComponent} · {slot.name} · classname"
                  value={slotClassNames}
                  placeholder="utility or global class"
                  onChange={({ value }) => updateSlotClass(slot.name, value ?? '')}
                />
                {#if slotCssVars.length > 0}
                  <div class="slot-var-controls">
                    {#each slotCssVars as varName (varName)}
                      <label class="slot-var-control">
                        {#if LENGTH_CSS_VARS.has(varName)}
                          <input
                            type="number"
                            class="slot-var-length"
                            min="0"
                            max="48"
                            step="1"
                            value={parseLengthPx(getCssVarValue(varName))}
                            aria-label="{selectedComponent} · {slot.name} · {varName}"
                            oninput={(event) =>
                              setLengthVarValue(varName, event.currentTarget.valueAsNumber)}
                          />
                        {:else}
                          <input
                            type="color"
                            class="slot-var-swatch"
                            value={getCssVarValue(varName)}
                            aria-label="{selectedComponent} · {slot.name} · {varName}"
                            oninput={(event) => setCssVarValue(varName, event.currentTarget.value)}
                          />
                        {/if}
                        <span class="slot-var-name">{varName}</span>
                      </label>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </section>

        <section class="pg-card">
          <Text size="small" weight="semibold">Copy</Text>
          <SnippetTabs
            component={selectedComponent}
            components={COMPONENT_OPTIONS}
            slotClassesByComponent={slotClassByComponent}
            {cssVarValues}
            availableForms={['instance']}
          />
        </section>
      </aside>

      <section class="pg-preview" style={previewVarsStyle}>
        <div class="preview-header">
          <Text size="small" weight="semibold">Preview</Text>
          <CompareButton bind:isComparing />
        </div>
        <div class="preview-stage">
          <div class="preview-variants">
            {#if selectedComponent === 'Button'}
              {#each ['primary'] as variant (variant)}
                <div class="preview-variant-row">
                  <Text size="small" color="surface.text.gray.muted">{variant}</Text>
                  <div class="preview-variant-samples">
                    <Button
                      variant={variant as 'primary' | 'secondary' | 'tertiary'}
                      styleOverride={previewStyleOverride as StyleOverride<ButtonSlot>}
                    >
                      Pay Now
                    </Button>
                    <Button
                      variant={variant as 'primary' | 'secondary' | 'tertiary'}
                      icon={SearchIcon}
                      styleOverride={previewStyleOverride as StyleOverride<ButtonSlot>}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              {/each}
              <div class="preview-variant-row">
                <Text size="small" color="surface.text.gray.muted">disabled opacity</Text>
                <div class="preview-variant-samples">
                  <Button styleOverride={{ root: 'cta-disabled-fade' }}>Pay Now</Button>
                  <Button isDisabled styleOverride={{ root: 'cta-disabled-fade' }}>Pay Now</Button>
                </div>
              </div>
            {:else if selectedComponent === 'IconButton'}
              {#each ['moderate', 'intense'] as emphasis (emphasis)}
                <div class="preview-variant-row">
                  <Text size="small" color="surface.text.gray.muted">{emphasis}</Text>
                  <div class="preview-variant-samples">
                    {#each ['small', 'medium', 'large'] as size (size)}
                      <IconButton
                        icon={SearchIcon}
                        emphasis={emphasis as 'moderate' | 'intense'}
                        size={size as 'small' | 'medium' | 'large'}
                        accessibilityLabel="Search {size}"
                        onClick={() => undefined}
                        styleOverride={previewStyleOverride as StyleOverride<IconButtonSlot>}
                      />
                    {/each}
                  </div>
                </div>
              {/each}
            {:else if selectedComponent === 'Text'}
              {#each ['small', 'medium', 'large'] as size (size)}
                <Text
                  variant="body"
                  size={size as 'small' | 'medium' | 'large'}
                  styleOverride={previewStyleOverride as StyleOverride<TextSlot>}
                >
                  Body · {size}
                </Text>
              {/each}
            {:else if selectedComponent === 'Heading'}
              {#each ['small', 'medium', 'large'] as size (size)}
                <Heading
                  size={size as 'small' | 'medium' | 'large'}
                  styleOverride={previewStyleOverride as StyleOverride<HeadingSlot>}
                >
                  Heading · {size}
                </Heading>
              {/each}
            {:else if selectedComponent === 'Amount'}
              {#each ['small', 'medium', 'large'] as size (size)}
                <Amount
                  value={1234.56}
                  type="body"
                  size={size as 'small' | 'medium' | 'large'}
                  styleOverride={previewStyleOverride as StyleOverride<AmountSlot>}
                />
              {/each}
            {:else if selectedComponent === 'AnnouncementBanner'}
              {#each [{ alignment: 'center' as const, label: 'center' }, { alignment: 'left' as const, label: 'left' }] as row (row.label)}
                <AnnouncementBanner
                  alignment={row.alignment}
                  icon={InfoIcon}
                  styleOverride={previewStyleOverride as StyleOverride<AnnouncementBannerSlot>}
                >
                  {row.label} · promotional text
                </AnnouncementBanner>
              {/each}
              <AnnouncementBanner
                styleOverride={previewStyleOverride as StyleOverride<AnnouncementBannerSlot>}
              >
                No icon
              </AnnouncementBanner>
            {:else if selectedComponent === 'Card'}
              {#each ['primary', 'secondary', 'theme'] as variant (variant)}
                <Card
                  variant={variant as 'primary' | 'secondary' | 'theme'}
                  styleOverride={previewStyleOverride as StyleOverride<CardSlot>}
                  width="min(100%, 320px)"
                >
                  {#snippet children()}
                    <Text size="medium">Card · {variant}</Text>
                  {/snippet}
                </Card>
              {/each}
            {:else if selectedComponent === 'AppBarLeading'}
              {#each ['neutral', 'subtle'] as variant (variant)}
                <div class="app-bar-preview-shell">
                  <AppBar variant={variant as 'neutral' | 'subtle'} isSticky={false}>
                    {#snippet children()}
                      <AppBarLeading
                        title="AppBarLeading · {variant}"
                        styleOverride={previewStyleOverride as StyleOverride<AppBarLeadingSlot>}
                      />
                      <AppBarActions>
                        <IconButton
                          icon={UserIcon}
                          emphasis="moderate"
                          accessibilityLabel="Account"
                          onClick={() => undefined}
                        />
                      </AppBarActions>
                    {/snippet}
                  </AppBar>
                </div>
              {/each}
            {:else if selectedComponent === 'Divider'}
              {#each ['normal', 'subtle', 'muted'] as variant (variant)}
                <div class="preview-divider-row" style="width: min(100%, 360px);">
                  <Text size="small" color="surface.text.gray.muted">{variant}</Text>
                  <Divider
                    variant={variant as 'normal' | 'subtle' | 'muted'}
                    styleOverride={previewStyleOverride as StyleOverride<DividerSlot>}
                  />
                </div>
              {/each}
            {:else if selectedComponent === 'Avatar'}
              {#each ['circle', 'square'] as variant (variant)}
                <div class="preview-variant-row">
                  <Text size="small" color="surface.text.gray.muted">{variant}</Text>
                  <div class="preview-variant-samples">
                    {#each ['medium', 'large'] as size (size)}
                      <Avatar
                        name="Maven Shop"
                        variant={variant as 'circle' | 'square'}
                        size={size as 'medium' | 'large'}
                        styleOverride={previewStyleOverride as StyleOverride<AvatarSlot>}
                      />
                    {/each}
                  </div>
                </div>
              {/each}
            {:else if selectedComponent === 'Accordion'}
              <div class="accordion-preview-shell">
                <Accordion
                  variant="transparent"
                  defaultExpandedIndex={0}
                  styleOverride={previewStyleOverride as StyleOverride<AccordionSlot>}
                >
                  {#snippet children()}
                    <AccordionItem>
                      {#snippet children()}
                        <AccordionItemHeader title="PhonePe Wallet" subtitle="+ ₹50 Extra Charge" />
                        <AccordionItemBody>
                          Enter phone number to continue with PhonePe Wallet payment.
                        </AccordionItemBody>
                      {/snippet}
                    </AccordionItem>
                    <AccordionItem>
                      {#snippet children()}
                        <AccordionItemHeader
                          title="HDFC Credit Card"
                          subtitle="No EMI Cost Available"
                        />
                        <AccordionItemBody>
                          Enter card details to pay with HDFC Credit Card.
                        </AccordionItemBody>
                      {/snippet}
                    </AccordionItem>
                  {/snippet}
                </Accordion>
              </div>
            {/if}
          </div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .story-shell {
    display: flex;
    justify-content: center;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-moderate);
  }

  .playground {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    width: min(100%, 1100px);
    box-sizing: border-box;
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-subtle);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    box-shadow: var(--elevation-low-raised);
  }

  .pg-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    max-width: 640px;
  }

  .pg-picker :global([data-blade-component='chip-group']) {
    flex-wrap: wrap;
  }

  .pg-body {
    display: grid;
    grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
    gap: var(--spacing-6);
    align-items: start;
  }

  .pg-controls {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    min-width: 0;
  }

  .pg-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-5);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
  }

  .pg-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .type-snippet {
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-4);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-subtle);
    background-color: var(--surface-background-gray-subtle);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
  }

  .slot-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .slot-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    width: 100%;
    min-width: 0;
  }

  .slot-var-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .slot-var-control {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    margin: 0;
    cursor: pointer;
  }

  .slot-var-name {
    font-family: var(--font-family-code);
    font-size: var(--font-size-25);
    line-height: 1;
    color: var(--surface-text-gray-muted);
    white-space: nowrap;
  }

  .slot-var-swatch {
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    cursor: pointer;
    background: transparent;
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden;
    appearance: none;
  }

  .slot-var-swatch::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  .slot-var-swatch::-webkit-color-swatch {
    border: none;
    border-radius: calc(var(--border-radius-small) - 1px);
  }

  .slot-var-swatch::-moz-color-swatch {
    border: none;
    border-radius: calc(var(--border-radius-small) - 1px);
  }

  .slot-var-length {
    width: 4rem;
    height: 1.75rem;
    padding: 0 var(--spacing-2);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-small);
    font-family: var(--font-family-code);
    font-size: var(--font-size-25);
    color: var(--surface-text-gray-normal);
    background-color: var(--surface-background-gray-subtle);
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .pg-preview {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    position: sticky;
    top: var(--spacing-6);
    box-sizing: border-box;
    padding: var(--spacing-5);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-intense);
  }

  .preview-header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-3);
  }

  .preview-stage {
    display: flex;
    width: 100%;
    padding: var(--spacing-6);
    box-sizing: border-box;
    border-radius: var(--border-radius-medium);
    background-color: var(--surface-background-gray-subtle);
  }

  .preview-variants {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-5);
    width: 100%;
  }

  .preview-variant-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2);
    width: 100%;
  }

  .preview-variant-samples {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .preview-divider-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    width: 100%;
  }

  .app-bar-preview-shell {
    width: min(100%, 375px);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
  }

  .accordion-preview-shell {
    width: min(100%, 480px);
  }

  @media (max-width: 900px) {
    .story-shell {
      padding: var(--spacing-3);
    }

    .playground {
      padding: var(--spacing-5);
    }

    .pg-body {
      grid-template-columns: minmax(0, 1fr);
    }

    .pg-preview {
      position: static;
    }
  }
</style>
