<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BladeProvider from './BladeProvider.svelte';

  /** Select labels → brand hex. Empty string = default bladeTheme (avoid `undefined` — breaks Controls). */
  const brandOptions: Record<string, string> = {
    Razorpay: '',
    ICICI: '#EE681A',
    Axis: '#83003D',
    SBI: '#15A5EB',
    IDBI: '#107259',
    Allahabad: '#FFF10A',
    BookMyShow: '#F32951',
    Swiggy: '#F86B15',
    Zomato: '#CF2033',
    'DSP Mutual Fund': '#19BEA2',
    Nykaa: '#DF005D',
  };

  /** Defaults match bladeTheme.border.radius */
  const DEFAULT_RADIUS = {
    small: 8,
    medium: 12,
    large: 16,
  } as const;

  /**
   * createTheme requires brandColor. When Controls keep Razorpay (empty mapping)
   * but radius is customized, use azure.500 so radius still flows through createTheme.
   */
  const RAZORPAY_BRAND_FALLBACK = 'hsla(218, 89%, 51%, 1)';

  const { Story } = defineMeta({
    title: 'Components/BladeProvider',
    component: BladeProvider,
    tags: ['autodocs'],
    args: {
      colorScheme: 'light',
      // Select option key — mapping converts to hex / '' before template sees it
      brand: 'Razorpay',
      radiusSmall: DEFAULT_RADIUS.small,
      radiusMedium: DEFAULT_RADIUS.medium,
      radiusLarge: DEFAULT_RADIUS.large,
    },
    argTypes: {
      colorScheme: {
        control: 'select',
        options: ['light', 'dark', 'system'],
        description: 'Color scheme for this provider scope',
        table: {
          type: { summary: "'light' | 'dark' | 'system'" },
          defaultValue: { summary: 'light' },
        },
      },
      // `brand` not `brandColor` — preview.js matcher `/(background|color)$/i` would force a color picker
      brand: {
        control: { type: 'select' },
        options: Object.keys(brandOptions),
        mapping: brandOptions,
        description: 'Passed to createTheme({ brandColor }).theme as themeTokens',
        table: {
          type: { summary: 'string' },
          defaultValue: { summary: "'' (bladeTheme)" },
        },
      },
      radiusSmall: {
        control: { type: 'range', min: 0, max: 32, step: 1 },
        description: 'createTheme({ borderRadius: { small } }) — buttons use this',
        table: {
          type: { summary: 'number' },
          defaultValue: { summary: '8' },
        },
      },
      radiusMedium: {
        control: { type: 'range', min: 0, max: 40, step: 1 },
        description: 'createTheme({ borderRadius: { medium } }) — cards / swatches',
        table: {
          type: { summary: 'number' },
          defaultValue: { summary: '12' },
        },
      },
      radiusLarge: {
        control: { type: 'range', min: 0, max: 48, step: 1 },
        description: 'createTheme({ borderRadius: { large } }) — demo panel shell',
        table: {
          type: { summary: 'number' },
          defaultValue: { summary: '16' },
        },
      },
      themeTokens: {
        control: false,
        table: { disable: true },
      },
      children: {
        control: false,
        table: { disable: true },
      },
    },
    parameters: {
      docs: {
        description: {
          component:
            'Theme scope for Blade Svelte. Pass `themeTokens` (`bladeTheme` or `createTheme(...).theme`) and optional `colorScheme`. Nested providers scope scheme via `data-blade-color-scheme`. Use `useTheme()` for runtime scheme changes.',
        },
      },
    },
  } as Parameters<typeof defineMeta>[0] & { argTypes: Record<string, unknown> });
</script>

<script lang="ts">
  import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
  import type { ColorSchemeNamesInput, ThemeTokens } from '@razorpay/blade-core/tokens';
  import Text from '../Typography/Text/Text.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import ThemeContextDemo from './ThemeContextDemo.svelte';
  import ThemeTokensPlayground from './ThemeTokensPlayground.svelte';

  type StoryArgs = {
    colorScheme?: ColorSchemeNamesInput;
    brand?: string;
    radiusSmall?: number;
    radiusMedium?: number;
    radiusLarge?: number;
  };

  function resolveThemeTokens(storyArgs: StoryArgs): ThemeTokens {
    const radiusSmall = storyArgs.radiusSmall ?? DEFAULT_RADIUS.small;
    const radiusMedium = storyArgs.radiusMedium ?? DEFAULT_RADIUS.medium;
    const radiusLarge = storyArgs.radiusLarge ?? DEFAULT_RADIUS.large;
    const hasCustomRadius =
      radiusSmall !== DEFAULT_RADIUS.small ||
      radiusMedium !== DEFAULT_RADIUS.medium ||
      radiusLarge !== DEFAULT_RADIUS.large;

    if (!storyArgs.brand && !hasCustomRadius) {
      return bladeTheme;
    }

    return createTheme({
      brandColor: storyArgs.brand || RAZORPAY_BRAND_FALLBACK,
      borderRadius: hasCustomRadius
        ? { small: radiusSmall, medium: radiusMedium, large: radiusLarge }
        : undefined,
    }).theme;
  }
</script>

<!-- Playground — in-UI chips / segments drive createTheme (not Controls panel) -->
<Story
  name="Playground"
  asChild
  parameters={{ controls: { disable: true } }}
>
  <ThemeTokensPlayground />
</Story>

<!-- Controls panel — args → createTheme brand + radius + colorScheme -->
<Story name="Controls Panel">
  {#snippet template(args)}
    {@const storyArgs = args as StoryArgs}
    <BladeProvider
      themeTokens={resolveThemeTokens(storyArgs)}
      colorScheme={storyArgs.colorScheme ?? 'light'}
    >
      <ThemeContextDemo />
    </BladeProvider>
  {/snippet}
</Story>

<!-- Nested scopes — light parent, dark child (static showcase) -->
<Story
  name="Nested Color Schemes"
  asChild
  parameters={{ controls: { disable: true } }}
>
  <div class="nested-layout">
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <div class="panel">
        <Heading size="medium" weight="semibold">Light scope</Heading>
        <Text size="small" color="surface.text.gray.muted">Outer provider</Text>
        <ThemeContextDemo />
        <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
          <div class="panel nested">
            <Heading size="medium" weight="semibold">Dark scope</Heading>
            <Text size="small" color="surface.text.gray.muted">Nested provider</Text>
            <ThemeContextDemo />
          </div>
        </BladeProvider>
      </div>
    </BladeProvider>
  </div>
</Story>

<!-- Brand override — args-driven so Controls work -->
<Story
  name="Custom Brand"
  args={{
    colorScheme: 'light',
    brand: 'DSP Mutual Fund',
  }}
>
  {#snippet template(args)}
    {@const storyArgs = args as StoryArgs}
    <BladeProvider
      themeTokens={resolveThemeTokens(storyArgs)}
      colorScheme={storyArgs.colorScheme ?? 'light'}
    >
      <ThemeContextDemo />
    </BladeProvider>
  {/snippet}
</Story>

<style>
  .nested-layout {
    padding: var(--spacing-5);
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-5);
    padding: var(--spacing-5);
    background-color: var(--surface-background-gray-subtle);
    border-radius: var(--border-radius-large);
  }

  .panel.nested {
    margin-top: var(--spacing-3);
  }
</style>
