<script lang="ts">
  import { bladeNeutralTheme, createTheme } from '@razorpay/blade-core/tokens';
  import type {
    ColorSchemeNamesInput,
    CreateThemeFontFamilyOverride,
    ThemeTokens,
  } from '@razorpay/blade-core/tokens';
  import BladeProvider from './BladeProvider.svelte';
  import Button from '../Button/Button.svelte';
  import IconButton from '../Button/IconButton/IconButton.svelte';
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
  import { SearchIcon } from '../Icons';

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

  const DEFAULT_RADIUS = {
    '2xsmall': 2,
    xsmall: 4,
    small: 8,
    medium: 12,
    large: 16,
  } as const;

  type RadiusKey = keyof typeof DEFAULT_RADIUS;

  const RADIUS_KEYS = Object.keys(DEFAULT_RADIUS) as RadiusKey[];

  const RADIUS_PRESETS: Record<string, Record<RadiusKey, number>> = {
    default: { ...DEFAULT_RADIUS },
    soft: { '2xsmall': 2, xsmall: 2, small: 4, medium: 8, large: 12 },
    round: { '2xsmall': 4, xsmall: 8, small: 16, medium: 24, large: 32 },
    sharp: { '2xsmall': 0, xsmall: 0, small: 0, medium: 0, large: 0 },
  };

  const PAGE_BG_PRESETS: { label: string; color: string }[] = [
    { label: 'Default', color: '' },
    { label: 'Cool gray', color: '#eef2f6' },
    { label: 'Warm sand', color: '#f7f3ed' },
    { label: 'Mint wash', color: '#edf8f5' },
  ];

  const FONT_PRESETS: { label: string; family?: CreateThemeFontFamilyOverride }[] = [
    { label: 'Blade default' },
    {
      label: 'System UI',
      family: {
        text: 'system-ui, -apple-system, Segoe UI, sans-serif',
        heading: 'system-ui, -apple-system, Segoe UI, sans-serif',
        code: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      },
    },
    {
      label: 'Serif',
      family: {
        text: 'Georgia, Times New Roman, serif',
        heading: 'Georgia, Times New Roman, serif',
      },
    },
  ];

  const RAZORPAY_BRAND_FALLBACK = 'hsla(218, 89%, 51%, 1)';

  let brandLabel = $state('Razorpay');
  let radiusPreset = $state('default');
  let radiusOverride = $state<Record<RadiusKey, number> | null>(null);
  let colorScheme = $state<ColorSchemeNamesInput>('system');
  let pageBgLabel = $state('Default');
  let fontPresetLabel = $state('Blade default');
  let fontSizeScaleFactor = $state('1');

  const brandHex = $derived(
    BRAND_PRESETS.find((b) => b.label === brandLabel)?.hex ?? '',
  );
  const borderRadius = $derived(
    radiusOverride ?? RADIUS_PRESETS[radiusPreset] ?? { ...DEFAULT_RADIUS },
  );
  const pageBackground = $derived(
    PAGE_BG_PRESETS.find((p) => p.label === pageBgLabel)?.color ?? '',
  );
  const fontFamilyOverride = $derived(
    FONT_PRESETS.find((f) => f.label === fontPresetLabel)?.family,
  );
  const fontSizeFactor = $derived(Number(fontSizeScaleFactor));

  const hasCustomRadius = $derived(
    RADIUS_KEYS.some((key) => borderRadius[key] !== DEFAULT_RADIUS[key]),
  );

  const usesCreateTheme = $derived(
    Boolean(brandHex) ||
      hasCustomRadius ||
      Boolean(pageBackground) ||
      Boolean(fontFamilyOverride) ||
      fontSizeFactor !== 1,
  );

  const themeBundle = $derived.by((): { themeTokens: ThemeTokens; fontFaceCSS?: string } => {
    if (!usesCreateTheme) {
      return { themeTokens: bladeNeutralTheme };
    }

    const scaleFactor = fontSizeFactor !== 1 ? fontSizeFactor : undefined;

    const { theme, fontFaceCSS } = createTheme({
      brandColor: brandHex || RAZORPAY_BRAND_FALLBACK,
      borderRadius: hasCustomRadius ? { ...borderRadius } : undefined,
      fontFamily: fontFamilyOverride,
      fontSizeScaleFactor: scaleFactor,
      surface: pageBackground
        ? { background: { page: pageBackground } }
        : undefined,
    });

    return { themeTokens: theme, fontFaceCSS };
  });

  const themeTokens = $derived(themeBundle.themeTokens);
  const fontFaceCSS = $derived(themeBundle.fontFaceCSS);

  const brandDisplay = $derived(brandHex || 'bladeNeutralTheme (default)');
  const radiusLabel = $derived(
    RADIUS_KEYS.map((key) => `${key} ${borderRadius[key]}px`).join(' · '),
  );

  const usageSnippet = $derived.by((): string => {
    const schemeAttr = `colorScheme="${colorScheme}"`;
    const fontFaceAttr = fontFaceCSS ? '\n  fontFaceCSS={fontFaceCSS}' : '';

    if (!usesCreateTheme) {
      return `<BladeProvider themeTokens={bladeNeutralTheme} ${schemeAttr}>
  ...
</BladeProvider>`;
    }

    const parts: string[] = [];
    parts.push(`brandColor: '${brandHex || RAZORPAY_BRAND_FALLBACK}'`);
    if (hasCustomRadius) {
      parts.push(
        `borderRadius: { ${RADIUS_KEYS.map((key) => `${key}: ${borderRadius[key]}`).join(', ')} }`,
      );
    }
    if (fontFamilyOverride) {
      parts.push(`fontFamily: ${JSON.stringify(fontFamilyOverride)}`);
    }
    if (fontSizeFactor !== 1) {
      parts.push(`fontSizeScaleFactor: ${fontSizeFactor}`);
    }
    if (pageBackground) {
      parts.push(`surface: { background: { page: '${pageBackground}' } }`);
    }

    return `<BladeProvider themeTokens={createTheme({ ${parts.join(', ')} }).theme}${fontFaceAttr} ${schemeAttr}>
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
</script>

<BladeProvider {themeTokens} {colorScheme} {fontFaceCSS}>
  <div class="story-shell">
    <div class="playground">
      <Heading size="large" weight="semibold">createTheme playground</Heading>
      <Text size="medium" color="surface.text.gray.muted">
        Page background maps to <Code size="small">surface.background.gray.moderate</Code>.
        Brand, radius, font, and scheme flow through <Code size="small">createTheme</Code> and
        <Code size="small">BladeProvider</Code> CSS variables on Blade components—not only story
        layout wrappers.
      </Text>

    <div class="meta">
      <Badge color="primary" emphasis="subtle">brand: {brandDisplay}</Badge>
      <Badge color="notice" emphasis="subtle">radius: {radiusLabel}</Badge>
      <Badge color="neutral" emphasis="subtle">scheme: {colorScheme}</Badge>
      <Badge color="information" emphasis="subtle">font: {fontPresetLabel}</Badge>
      <Badge color="information" emphasis="subtle">type scale: {fontSizeScaleFactor}×</Badge>
      {#if pageBackground}
        <Badge color="positive" emphasis="subtle">page bg: {pageBackground}</Badge>
      {/if}
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
        <Button variant="tertiary" size="small" onClick={() => bumpRadius(-2)}>
          Radius −
        </Button>
        <Button variant="tertiary" size="small" onClick={() => bumpRadius(2)}>
          Radius +
        </Button>
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

    <div class="swatch-row">
      <div class="swatch moderate" title="gray moderate (page)"></div>
      <div class="swatch primary" title="primary intense"></div>
      <div class="swatch gray" title="gray subtle"></div>
    </div>

    <div class="surface-showcase">
      <Text size="small" weight="semibold">Component radius showcase</Text>
      <Text size="small" color="surface.text.gray.muted">
        Button and IconButton corner radius follow theme tokens (IconButton uses
        <Code size="small">2xsmall</Code> at small size).
      </Text>
      <div class="component-radius-row">
        <Button variant="primary" size="medium">Primary</Button>
        <Button variant="secondary" size="medium">Secondary</Button>
        <IconButton
          icon={SearchIcon}
          emphasis="intense"
          size="small"
          accessibilityLabel="Search"
          onClick={() => undefined}
        />
        <IconButton
          icon={SearchIcon}
          emphasis="moderate"
          size="medium"
          accessibilityLabel="Search"
          onClick={() => undefined}
        />
      </div>
    </div>

    <div class="surface-showcase">
      <Text size="small" weight="semibold">Surface on components</Text>
      <Text size="small" color="surface.text.gray.muted">
        Change page background above — secondary Card and the moderate swatch should move
        together. Primary-tinted Card stays on brand surface tokens.
      </Text>
      <div class="surface-cards">
        <Card variant="secondary" borderRadius="medium">
          <CardBody>
            <Badge color="positive" emphasis="subtle" size="small">Page canvas token</Badge>
            <Heading size="small" weight="semibold">Secondary Card</Heading>
            <Text size="small" color="surface.text.gray.muted">
              Uses <Code size="small">surface.background.gray.moderate</Code> (same as page
              background override).
            </Text>
          </CardBody>
        </Card>
        <Card
          variant="theme"
          backgroundColor="surface.background.primary.subtle"
          borderRadius="medium"
        >
          <CardBody>
            <Badge color="primary" emphasis="subtle" size="small">Brand surface</Badge>
            <Heading size="small" weight="semibold">Theme Card</Heading>
            <Text size="small" color="surface.text.gray.muted">
              <Code size="small">surface.background.primary.subtle</Code> — shifts with brand
              color, not page background.
            </Text>
            <div class="actions">
              <Button variant="primary" size="medium">Primary</Button>
              <Button variant="secondary" size="medium">Secondary</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
    </div>
  </div>
</BladeProvider>

<style>
  .story-shell {
    box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
    padding: var(--spacing-8);
  }

  .playground {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-8);
    background-color: var(--surface-background-gray-intense);
    border-radius: var(--border-radius-large);
    border: 1px solid var(--surface-border-gray-muted);
    max-width: 640px;
    margin: 0 auto;
    box-shadow: var(--elevation-low-raised);
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

  .surface-showcase {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3);
  }

  .component-radius-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-3);
  }

  .radius-input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
    gap: var(--spacing-3);
    width: 100%;
  }

  .radius-input {
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
    background-color: var(--surface-background-gray-subtle);
    color: var(--surface-text-gray-normal);
  }

  .surface-cards {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-4);
  }

  @media (max-width: 560px) {
    .surface-cards {
      grid-template-columns: 1fr;
    }
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

  .moderate {
    background-color: var(--surface-background-gray-moderate);
  }

  .primary {
    background-color: var(--surface-background-primary-intense);
  }

  .gray {
    background-color: var(--surface-background-gray-subtle);
  }
</style>
