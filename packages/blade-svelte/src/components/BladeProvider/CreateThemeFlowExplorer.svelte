<script lang="ts">
  import { createTheme } from '@razorpay/blade-core/tokens';
  import type { ColorSchemeNamesInput } from '@razorpay/blade-core/tokens';
  import BladeProvider from './BladeProvider.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Button from '../Button/Button.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import Chip from '../Chip/Chip.svelte';
  import ChipGroup from '../Chip/ChipGroup.svelte';
  import SegmentedControl from '../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../SegmentedControl/SegmentedControlItem.svelte';

  type ShadeUsage = 'theme' | 'conditional' | 'contrast-only' | 'unused';

  type TokenMappingRow = {
    label: string;
    path: string;
    brandKey: string;
    note?: string;
    schemes: ('light' | 'dark')[];
  };

  const BRAND_PRESETS: { label: string; hex: string }[] = [
    { label: 'DSP', hex: '#19BEA2' },
    { label: 'Axis', hex: '#83003D' },
    { label: 'ICICI', hex: '#EE681A' },
    { label: 'Zomato', hex: '#CF2033' },
    { label: 'Nykaa', hex: '#DF005D' },
    { label: 'Light green', hex: '#5EDD55' },
    { label: 'Allahabad', hex: '#FFF10A' },
  ];

  const FLOW_STEPS = [
    {
      title: 'brandColor',
      detail: 'Single CSS color (hex / rgb / hsl). Merchant primary brand input.',
    },
    {
      title: 'generateChromaticBrandColors',
      detail: 'tinycolor brighten/darken → 11 solid steps (50–1000). 600 = input color.',
    },
    {
      title: 'getOnLight / getOnDark overrides',
      detail: 'Subset of brandColors mapped to semantic interactive + surface primary tokens.',
    },
    {
      title: 'overrideTheme(bladeTheme)',
      detail: 'Deep-merge brand overrides onto default Razorpay theme.',
    },
    {
      title: 'BladeProvider → CSS vars',
      detail: 'themeToCssVariables exposes tokens as --interactive-* / --surface-* for components.',
    },
  ] as const;

  const SOLID_KEYS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'] as const;
  const ALPHA_KEYS = ['a50', 'a150', 'a100', 'a200', 'a400'] as const;

  const SHADE_USAGE: Record<string, ShadeUsage> = {
    '50': 'unused',
    '100': 'unused',
    '200': 'unused',
    '300': 'unused',
    '400': 'conditional',
    '500': 'unused',
    '600': 'theme',
    '700': 'theme',
    '800': 'unused',
    '900': 'contrast-only',
    '1000': 'unused',
    a50: 'unused',
    a150: 'theme',
    a100: 'theme',
    a200: 'theme',
    a400: 'theme',
  };

  const TOKEN_MAPPINGS: TokenMappingRow[] = [
    {
      label: 'Primary button / fill default',
      path: 'interactive.background.primary.default',
      brandKey: '600',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary button / fill hover',
      path: 'interactive.background.primary.highlighted',
      brandKey: '700',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary disabled / faded background',
      path: 'interactive.background.primary.disabled',
      brandKey: 'a100',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary faded highlighted',
      path: 'interactive.background.primary.fadedHighlighted',
      brandKey: 'a150',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary border default',
      path: 'interactive.border.primary.default',
      brandKey: '600',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary border hover',
      path: 'interactive.border.primary.highlighted',
      brandKey: '700',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Secondary text/icon on surface (brand)',
      path: 'interactive.text.primary.normal',
      brandKey: '600 or neutral fallback',
      note: 'Light: 600 if WCAG readable on surface, else neutral. Dark: 400 if readable, else neutral.',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Primary disabled text/icon',
      path: 'interactive.text.primary.disabled',
      brandKey: 'a200 (light) / a400 (dark)',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Text on primary button',
      path: 'interactive.text.onPrimary.normal',
      brandKey: 'white or black (via 900)',
      note: 'mostReadable on brandColors[900] — not a direct 900 assignment.',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Surface primary intense',
      path: 'surface.background.primary.intense',
      brandKey: '600',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Surface primary subtle',
      path: 'surface.background.primary.subtle',
      brandKey: 'a150',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Surface primary border',
      path: 'surface.border.primary.normal',
      brandKey: '600',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Surface primary border muted',
      path: 'surface.border.primary.muted',
      brandKey: 'a200',
      schemes: ['light', 'dark'],
    },
    {
      label: 'Surface primary text / icon',
      path: 'surface.text.primary.normal',
      brandKey: '600',
      schemes: ['light'],
    },
    {
      label: 'Surface primary icon',
      path: 'surface.icon.primary.normal',
      brandKey: '600',
      schemes: ['light', 'dark'],
    },
  ];

  let brandHex = $state('#19BEA2');
  let colorScheme = $state<ColorSchemeNamesInput>('light');

  const themeResult = $derived.by(() => createTheme({ brandColor: brandHex }));
  const themeTokens = $derived(themeResult.theme);
  const brandColors = $derived(themeResult.brandColors);

  const activeSchemeKey = $derived(colorScheme === 'dark' ? 'onDark' : 'onLight');
  const activeColors = $derived(
    colorScheme === 'dark' ? themeTokens.colors.onDark : themeTokens.colors.onLight,
  );

  const usedInThemeCount = $derived(
    Object.values(SHADE_USAGE).filter((usage) => usage === 'theme' || usage === 'conditional')
      .length,
  );

  const visibleMappings = $derived(
    TOKEN_MAPPINGS.filter((row) =>
      row.schemes.includes(colorScheme === 'dark' ? 'dark' : 'light'),
    ),
  );

  function getNestedValue(obj: unknown, path: string): string | undefined {
    const value = path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
    return typeof value === 'string' ? value : undefined;
  }

  function usageLabel(usage: ShadeUsage): string {
    if (usage === 'theme') return 'In theme';
    if (usage === 'conditional') return 'Conditional';
    if (usage === 'contrast-only') return 'Contrast only';
    return 'Unused';
  }

  function usageBadgeColor(
    usage: ShadeUsage,
  ): 'positive' | 'information' | 'notice' | 'neutral' {
    if (usage === 'theme') return 'positive';
    if (usage === 'conditional') return 'information';
    if (usage === 'contrast-only') return 'notice';
    return 'neutral';
  }

  function onBrandChange(payload: { name: string; values: string[] }): void {
    const preset = BRAND_PRESETS.find((item) => item.label === payload.values[0]);
    if (preset) brandHex = preset.hex;
  }

  function onSchemeChange(payload: { name?: string; value: string }): void {
    if (payload.value === 'light' || payload.value === 'dark') {
      colorScheme = payload.value;
    }
  }

  function onBrandInput(event: Event): void {
    const target = event.currentTarget as HTMLInputElement;
    if (target.value) brandHex = target.value;
  }

  function selectedPresetLabel(): string {
    return BRAND_PRESETS.find((item) => item.hex === brandHex)?.label ?? 'Custom';
  }

  function paletteEntries(keys: readonly string[]): { key: string; value: string }[] {
    const colors = brandColors as Record<string, string>;
    return keys.map((key) => ({
      key,
      value: colors[key],
    }));
  }
</script>

<BladeProvider themeTokens={themeTokens} {colorScheme}>
  <div class="explorer">
    <header class="header">
      <Heading size="large" weight="semibold">createTheme flow</Heading>
      <Text size="medium" color="surface.text.gray.muted">
        Visual reference for design review: how
        <Code size="small">brandColor</Code>
        becomes a chromatic scale, which steps feed theme tokens, and what components consume.
        Source:
        <Code size="small">packages/blade-core/src/tokens/theme/createTheme.ts</Code>
      </Text>
    </header>

    <section class="section">
      <Heading size="medium" weight="semibold">1. Pipeline</Heading>
      <div class="flow">
        {#each FLOW_STEPS as step, index (step.title)}
          <div class="flow-step">
            <div class="flow-index">{index + 1}</div>
            <div class="flow-body">
              <Text as="span" size="small" weight="semibold" textAlign="left" wordBreak="break-word">
                {step.title}
              </Text>
              <Text
                as="span"
                size="small"
                color="surface.text.gray.muted"
                textAlign="left"
                wordBreak="break-word"
              >
                {step.detail}
              </Text>
            </div>
          </div>
          {#if index < FLOW_STEPS.length - 1}
            <div class="flow-arrow" aria-hidden="true">→</div>
          {/if}
        {/each}
      </div>
    </section>

    <section class="section controls">
      <Heading size="medium" weight="semibold">2. Inputs</Heading>
      <div class="control-row">
        <Text size="small" weight="semibold">Brand preset</Text>
        <ChipGroup
          accessibilityLabel="Brand preset"
          selectionType="single"
          size="small"
          value={selectedPresetLabel()}
          onChange={onBrandChange}
        >
          {#each BRAND_PRESETS as preset (preset.label)}
            <Chip value={preset.label}>{preset.label}</Chip>
          {/each}
        </ChipGroup>
      </div>
      <div class="control-row">
        <Text size="small" weight="semibold">Custom brandColor</Text>
        <div class="color-input-row">
          <input
            class="color-input"
            type="color"
            value={brandHex}
            oninput={onBrandInput}
            aria-label="Pick brand color"
          />
          <Code size="small">{brandHex}</Code>
          <Badge color="primary" emphasis="subtle">maps to brandColors[600]</Badge>
        </div>
      </div>
      <div class="control-row">
        <Text size="small" weight="semibold">Preview scheme</Text>
        <SegmentedControl
          accessibilityLabel="Color scheme"
          size="small"
          value={colorScheme}
          onChange={onSchemeChange}
        >
          <SegmentedControlItem value="light">onLight</SegmentedControlItem>
          <SegmentedControlItem value="dark">onDark</SegmentedControlItem>
        </SegmentedControl>
      </div>
    </section>

    <section class="section">
      <Heading size="medium" weight="semibold">3. Generated brandColors</Heading>
      <Text size="small" color="surface.text.gray.muted">
        Full palette returned by
        <Code size="small">createTheme().brandColors</Code>
        . Only
        <Code size="small">{usedInThemeCount}</Code>
        of
        <Code size="small">{SOLID_KEYS.length + ALPHA_KEYS.length}</Code>
        keys are referenced in theme overrides (plus
        <Code size="small">900</Code>
        for contrast math).
      </Text>

      <Text size="small" weight="semibold">Solid scale</Text>
      <div class="palette">
        {#each paletteEntries(SOLID_KEYS) as entry (entry.key)}
          {@const usage = SHADE_USAGE[entry.key]}
          <div class="swatch-card" class:swatch-card--dim={usage === 'unused'}>
            <div class="swatch" style:background-color={entry.value} title={entry.value}></div>
            <div class="swatch-meta">
              <Text size="small" weight="semibold">{entry.key}</Text>
              <Badge color={usageBadgeColor(usage)} emphasis="subtle" size="small">
                {usageLabel(usage)}
              </Badge>
              {#if entry.key === '600'}
                <Badge color="primary" emphasis="intense" size="small">= brandColor</Badge>
              {/if}
            </div>
            <span class="swatch-value">
              <Text size="small" color="surface.text.gray.muted">{entry.value}</Text>
            </span>
          </div>
        {/each}
      </div>

      <Text size="small" weight="semibold">Alpha variants (from 600)</Text>
      <div class="palette palette--alpha">
        {#each paletteEntries(ALPHA_KEYS) as entry (entry.key)}
          {@const usage = SHADE_USAGE[entry.key]}
          <div class="swatch-card" class:swatch-card--dim={usage === 'unused'}>
            <div
              class="swatch swatch--checker"
              style:background-color={entry.value}
              title={entry.value}
            ></div>
            <div class="swatch-meta">
              <Text size="small" weight="semibold">{entry.key}</Text>
              <Badge color={usageBadgeColor(usage)} emphasis="subtle" size="small">
                {usageLabel(usage)}
              </Badge>
            </div>
            <span class="swatch-value">
              <Text size="small" color="surface.text.gray.muted">{entry.value}</Text>
            </span>
          </div>
        {/each}
      </div>
    </section>

    <section class="section">
      <Heading size="medium" weight="semibold">
        4. Semantic token mapping ({activeSchemeKey})
      </Heading>
      <Text size="small" color="surface.text.gray.muted">
        Resolved values from
        <Code size="small">theme.colors.{activeSchemeKey}</Code>
        after
        <Code size="small">createTheme</Code>
        . Compare swatch to brandColors key on the right.
      </Text>

      <div class="mapping-table" role="table" aria-label="Theme token mapping">
        <div class="mapping-row mapping-row--head" role="row">
          <span role="columnheader">UI role</span>
          <span role="columnheader">Theme path</span>
          <span role="columnheader">brandColors key</span>
          <span role="columnheader">Resolved</span>
        </div>
        {#each visibleMappings as row (row.path)}
          {@const resolved = getNestedValue(activeColors, row.path)}
          <div class="mapping-row" role="row">
            <span role="cell">
              <Text size="small" weight="semibold">{row.label}</Text>
              {#if row.note}
                <Text size="small" color="surface.text.gray.muted">{row.note}</Text>
              {/if}
            </span>
            <span role="cell">
              <Code size="small">colors.{activeSchemeKey}.{row.path}</Code>
            </span>
            <span role="cell">
              <Code size="small">{row.brandKey}</Code>
            </span>
            <span role="cell" class="resolved-cell">
              {#if resolved}
                <span class="mini-swatch" style:background-color={resolved}></span>
                <Text size="small" color="surface.text.gray.muted">{resolved}</Text>
              {:else}
                <Text size="small" color="surface.text.gray.muted">—</Text>
              {/if}
            </span>
          </div>
        {/each}
      </div>
    </section>

    <section class="section">
      <Heading size="medium" weight="semibold">5. Component preview</Heading>
      <Text size="small" color="surface.text.gray.muted">
        Live output on
        <Code size="small">{colorScheme}</Code>
        scheme — primary uses
        <Code size="small">600</Code>
        /
        <Code size="small">700</Code>
        , subtle surfaces use
        <Code size="small">a150</Code>
        .
      </Text>
      <div class="preview-row">
        <Button variant="primary">Primary</Button>
        <Button variant="primary" isDisabled>Primary disabled</Button>
        <Button variant="secondary">Secondary (brand text)</Button>
      </div>
      <Card
        variant="theme"
        backgroundColor="surface.background.primary.subtle"
        borderRadius="medium"
      >
        <CardBody>
          <Heading size="small" weight="semibold">Primary subtle surface</Heading>
          <Text size="small" color="surface.text.primary.normal">
            surface.text.primary.normal → brandColors[600]
          </Text>
        </CardBody>
      </Card>
    </section>

    <section class="section legend">
      <Heading size="small" weight="semibold">Legend</Heading>
      <div class="legend-row">
        <Badge color="positive" emphasis="subtle">In theme</Badge>
        <Text size="small" color="surface.text.gray.muted">Assigned to semantic token</Text>
      </div>
      <div class="legend-row">
        <Badge color="information" emphasis="subtle">Conditional</Badge>
        <Text size="small" color="surface.text.gray.muted">
          400 — dark secondary foreground if WCAG passes, else neutral
        </Text>
      </div>
      <div class="legend-row">
        <Badge color="notice" emphasis="subtle">Contrast only</Badge>
        <Text size="small" color="surface.text.gray.muted">
          900 — background for mostReadable; not a theme slot
        </Text>
      </div>
      <div class="legend-row">
        <Badge color="neutral" emphasis="subtle">Unused</Badge>
        <Text size="small" color="surface.text.gray.muted">
          Generated + returned in brandColors; not wired by createTheme today
        </Text>
      </div>
    </section>
  </div>
</BladeProvider>

<style>
  .explorer {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    padding: var(--spacing-8);
    max-width: 960px;
    background-color: var(--surface-background-gray-moderate);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .header,
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .flow {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    gap: var(--spacing-3);
  }

  .flow-step {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
    flex: 1 1 0;
    min-width: 0;
    padding: var(--spacing-4);
    background-color: var(--surface-background-gray-subtle);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
  }

  .flow-index {
    flex: none;
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    border-radius: var(--border-radius-round);
    background-color: var(--surface-background-primary-intense);
    color: var(--interactive-text-on-primary-normal);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    font-weight: 600;
  }

  .flow-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-1);
    width: 100%;
    min-width: 0;
    text-align: left;
  }

  .flow-arrow {
    align-self: center;
    color: var(--surface-text-gray-muted);
    font-size: var(--font-size-300);
    line-height: 1;
  }

  .controls {
    padding: var(--spacing-5);
    background-color: var(--surface-background-gray-subtle);
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .control-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .color-input-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .color-input {
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    cursor: pointer;
    background: none;
  }

  .palette {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-3);
  }

  .palette--alpha {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .swatch-card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    padding: var(--spacing-3);
    background-color: var(--surface-background-gray-subtle);
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
  }

  .swatch-card--dim {
    opacity: 0.55;
  }

  .swatch {
    height: 48px;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .swatch--checker {
    background-image:
      linear-gradient(45deg, var(--surface-background-gray-moderate) 25%, transparent 25%),
      linear-gradient(-45deg, var(--surface-background-gray-moderate) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, var(--surface-background-gray-moderate) 75%),
      linear-gradient(-45deg, transparent 75%, var(--surface-background-gray-moderate) 75%);
    background-size: 12px 12px;
    background-position:
      0 0,
      0 6px,
      6px -6px,
      -6px 0;
  }

  .swatch-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-2);
  }

  .swatch-value {
    font-family: var(--font-family-code);
    font-size: var(--font-size-50);
    word-break: break-all;
  }

  .mapping-table {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--surface-border-gray-muted);
    border-radius: var(--border-radius-medium);
    overflow: hidden;
  }

  .mapping-row {
    display: grid;
    grid-template-columns: 1.2fr 1.4fr 0.9fr 1.3fr;
    gap: var(--spacing-3);
    padding: var(--spacing-3) var(--spacing-4);
    border-bottom: 1px solid var(--surface-border-gray-muted);
    background-color: var(--surface-background-gray-subtle);
  }

  .mapping-row:last-child {
    border-bottom: none;
  }

  .mapping-row--head {
    background-color: var(--surface-background-gray-moderate);
    font-family: var(--font-family-code);
    font-size: var(--font-size-75);
    font-weight: 600;
    color: var(--surface-text-gray-muted);
  }

  .resolved-cell {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    min-width: 0;
  }

  .mini-swatch {
    flex: none;
    width: 16px;
    height: 16px;
    border-radius: var(--border-radius-small);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .preview-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
  }

  .legend {
    padding-top: var(--spacing-4);
    border-top: 1px solid var(--surface-border-gray-muted);
  }

  .legend-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  @media (max-width: 768px) {
    .mapping-row {
      grid-template-columns: 1fr;
    }

    .flow-arrow {
      display: none;
    }
  }
</style>
