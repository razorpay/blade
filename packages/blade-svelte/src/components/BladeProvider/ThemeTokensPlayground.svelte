<script lang="ts">
  import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
  import type { ColorSchemeNamesInput, ThemeTokens } from '@razorpay/blade-core/tokens';
  import BladeProvider from './BladeProvider.svelte';
  import Button from '../Button/Button.svelte';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import Badge from '../Badge/Badge.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import Card from '../Card/Card.svelte';
  import CardBody from '../Card/CardBody.svelte';
  import Chip from '../Chip/Chip.svelte';
  import ChipGroup from '../Chip/ChipGroup.svelte';
  import SegmentedControl from '../SegmentedControl/SegmentedControl.svelte';
  import SegmentedControlItem from '../SegmentedControl/SegmentedControlItem.svelte';

  /** Brand label → hex. Empty = default bladeTheme (unless radius customized). */
  const BRAND_PRESETS: { label: string; hex: string }[] = [
    { label: 'Razorpay', hex: '' },
    { label: 'ICICI', hex: '#EE681A' },
    { label: 'Axis', hex: '#83003D' },
    { label: 'SBI', hex: '#15A5EB' },
    { label: 'IDBI', hex: '#107259' },
    { label: 'BookMyShow', hex: '#F32951' },
    { label: 'Swiggy', hex: '#F86B15' },
    { label: 'Zomato', hex: '#CF2033' },
    { label: 'DSP', hex: '#19BEA2' },
    { label: 'Nykaa', hex: '#DF005D' },
  ];

  const DEFAULT_RADIUS = { small: 8, medium: 12, large: 16 } as const;

  const RADIUS_PRESETS: Record<
    string,
    { small: number; medium: number; large: number }
  > = {
    default: { ...DEFAULT_RADIUS },
    soft: { small: 4, medium: 8, large: 12 },
    round: { small: 16, medium: 24, large: 32 },
    sharp: { small: 0, medium: 0, large: 0 },
  };

  /** createTheme needs brandColor; use azure when Razorpay + custom radius. */
  const RAZORPAY_BRAND_FALLBACK = 'hsla(218, 89%, 51%, 1)';

  let brandLabel = $state('Razorpay');
  let radiusPreset = $state('default');
  let radiusOverride = $state<{
    small: number;
    medium: number;
    large: number;
  } | null>(null);
  let colorScheme = $state<ColorSchemeNamesInput>('light');

  const brandHex = $derived(
    BRAND_PRESETS.find((b) => b.label === brandLabel)?.hex ?? '',
  );
  const borderRadius = $derived(
    radiusOverride ?? RADIUS_PRESETS[radiusPreset] ?? { ...DEFAULT_RADIUS },
  );

  const hasCustomRadius = $derived(
    borderRadius.small !== DEFAULT_RADIUS.small ||
      borderRadius.medium !== DEFAULT_RADIUS.medium ||
      borderRadius.large !== DEFAULT_RADIUS.large,
  );

  const themeTokens = $derived.by((): ThemeTokens => {
    if (!brandHex && !hasCustomRadius) {
      return bladeTheme;
    }
    return createTheme({
      brandColor: brandHex || RAZORPAY_BRAND_FALLBACK,
      borderRadius: hasCustomRadius ? { ...borderRadius } : undefined,
    }).theme;
  });

  const brandDisplay = $derived(brandHex || 'bladeTheme (default)');
  const radiusLabel = $derived(
    `sm ${borderRadius.small} · md ${borderRadius.medium} · lg ${borderRadius.large}`,
  );

  /** Live BladeProvider usage string — mirrors themeTokens + colorScheme resolution. */
  const usageSnippet = $derived.by((): string => {
    const schemeAttr = `colorScheme="${colorScheme}"`;
    if (!brandHex && !hasCustomRadius) {
      return `<BladeProvider themeTokens={bladeTheme} ${schemeAttr}>
  ...
</BladeProvider>`;
    }

    const parts: string[] = [];
    parts.push(`brandColor: '${brandHex || RAZORPAY_BRAND_FALLBACK}'`);
    if (hasCustomRadius) {
      parts.push(
        `borderRadius: { small: ${borderRadius.small}, medium: ${borderRadius.medium}, large: ${borderRadius.large} }`,
      );
    }
    return `<BladeProvider themeTokens={createTheme({ ${parts.join(', ')} }).theme} ${schemeAttr}>
  ...
</BladeProvider>`;
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

  function bumpRadius(delta: number): void {
    radiusOverride = {
      small: Math.max(0, Math.min(32, borderRadius.small + delta)),
      medium: Math.max(0, Math.min(40, borderRadius.medium + delta)),
      large: Math.max(0, Math.min(48, borderRadius.large + delta)),
    };
  }
</script>

<BladeProvider themeTokens={themeTokens} {colorScheme}>
  <div class="playground">
    <Heading size="large" weight="semibold">createTheme playground</Heading>
    <Text size="medium" color="surface.text.gray.muted">
      In-UI controls update <Code size="small">brandColor</Code>,
      <Code size="small">borderRadius</Code>, and
      <Code size="small">colorScheme</Code> via
      <Code size="small">createTheme</Code> +
      <Code size="small">BladeProvider</Code>.
    </Text>

    <div class="meta">
      <Badge color="primary" emphasis="subtle">brand: {brandDisplay}</Badge>
      <Badge color="notice" emphasis="subtle">radius: {radiusLabel}</Badge>
      <Badge color="neutral" emphasis="subtle">scheme: {colorScheme}</Badge>
      {#if radiusOverride}
        <Badge color="information" emphasis="subtle">radius: custom nudge</Badge>
      {/if}
    </div>

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
        <Button variant="tertiary" size="small" onClick={() => bumpRadius(-2)}>
          Radius −
        </Button>
        <Button variant="tertiary" size="small" onClick={() => bumpRadius(2)}>
          Radius +
        </Button>
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

    <div class="swatch-row">
      <div class="swatch primary" title="primary intense"></div>
      <div class="swatch surface" title="gray intense"></div>
      <div class="swatch gray" title="gray subtle"></div>
    </div>

    <Card
      variant="theme"
      backgroundColor="surface.background.primary.subtle"
      borderRadius="medium"
    >
      <CardBody>
        <Heading size="small" weight="semibold">Live preview</Heading>
        <Text size="small" color="surface.text.gray.muted">
          Swatches + card corners track brand + radius. Buttons use
          <Code size="small">small</Code> radius; card uses
          <Code size="small">medium</Code>; panel uses
          <Code size="small">large</Code>.
        </Text>
        <div class="actions">
          <Button variant="primary" size="medium">Primary</Button>
          <Button variant="secondary" size="medium">Secondary</Button>
        </div>
      </CardBody>
    </Card>
  </div>
</BladeProvider>

<style>
  .playground {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-moderate);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    max-width: 560px;
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
    background-color: var(--surface-background-gray-subtle);
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

  .swatch-row {
    display: flex;
    gap: var(--spacing-3);
  }

  .swatch {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-medium);
    border: 1px solid var(--surface-border-gray-muted);
  }

  .primary {
    background-color: var(--surface-background-primary-intense);
  }

  .surface {
    background-color: var(--surface-background-gray-intense);
  }

  .gray {
    background-color: var(--surface-background-gray-subtle);
  }
</style>
