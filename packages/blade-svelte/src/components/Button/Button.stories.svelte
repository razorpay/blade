<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import { iconMap } from '../Icons';
  import { CloseIcon, SearchIcon } from '../Icons';
  import Text from '../Typography/Text/Text.svelte';

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
      children: 'Click me',
      variant: 'primary',
      size: 'medium',
      color: 'primary',
      isDisabled: false,
      isLoading: false,
      isFullWidth: false,
      icon: undefined,
      iconPosition: 'left',
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Button text content',
        table: {
          defaultValue: { summary: 'Click me' },
        },
      },
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'tertiary'],
        description: 'Button variant that defines the visual style',
        table: {
          defaultValue: { summary: 'primary' },
        },
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
        description: 'Size of the button',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      color: {
        control: 'select',
        options: ['primary', 'white', 'positive', 'negative'],
        description: 'Color theme of the button',
        table: {
          defaultValue: { summary: 'primary' },
        },
      },
      isDisabled: {
        control: 'boolean',
        description: 'Whether the button is disabled',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      isLoading: {
        control: 'boolean',
        description: 'Whether the button is in a loading state',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      isFullWidth: {
        control: 'boolean',
        description: 'Whether the button should take the full width of its container',
        table: {
          defaultValue: { summary: 'false' },
        },
      },
      icon: {
        control: 'select',
        options: Object.keys(iconMap),
        mapping: iconMap,
        description: 'Icon to display alongside the button text',
        table: {
          defaultValue: { summary: 'None' },
        },
      },
      iconPosition: {
        control: 'select',
        options: ['left', 'right'],
        description: 'Position of the icon relative to the button text',
        table: {
          defaultValue: { summary: 'left' },
        },
      },
      loadingType: {
        control: 'select',
        options: ['indefinite', 'definite'],
        description:
          'Type of loading indicator. `indefinite` shows a 3-dot loader (driven by `isLoading`); `definite` shows a left-to-right progress overlay over `loadingTimer` ms',
        table: {
          defaultValue: { summary: 'indefinite' },
        },
      },
      loadingTimer: {
        control: 'number',
        description:
          'Duration (ms) over which the `definite` progress overlay fills from 0% to 100%. Required when `loadingType` is `definite`',
        table: {
          defaultValue: { summary: 'undefined' },
        },
      },
      avatars: {
        control: 'object',
        description:
          'Avatars rendered after the button text as an avatar group. Only shown for `large` buttons',
        table: {
          defaultValue: { summary: 'undefined' },
        },
      },
    },
  });

  // Use seeded picsum URLs so each avatar resolves to a stable image across loads,
  // keeping story snapshots deterministic.
  const sampleAvatars = [
    { name: 'Nitin Kumar', src: 'https://avatars.githubusercontent.com/u/46647141?v=4' },
    { name: 'Kamlesh Chandnani', src: 'https://picsum.photos/seed/kamlesh/200' },
    { name: 'Rama Krushna Behera', src: 'https://picsum.photos/seed/rama/200' },
  ];
</script>

<script lang="ts">
  import Heading from '../Typography/Heading/Heading.svelte';
  import Code from '../Typography/Code/Code.svelte';
  import type { StyleOverride } from '@razorpay/blade-core/styles';
  import type { ButtonSlot } from '@razorpay/blade-core/styles';
  import { getPrimaryBrandCssVars } from '@razorpay/blade-core/styles';
  import { cssVariablesToInlineStyle } from '@razorpay/blade-core/utils';

  const styleOverride: StyleOverride<ButtonSlot> = {
    root: 'bg-(--brand-bg)',
    text: 'text-(--brand-text)',
  };

  const styleOverrideSnippet =
    "styleOverride={{ root: 'bg-(--brand-bg)', text: 'text-(--brand-text)' }}";

  const brandBgTokenVars = getPrimaryBrandCssVars({ bg: 'var(--brand-bg)' });
  const brandBgUtilityDeclarations = `${cssVariablesToInlineStyle(brandBgTokenVars)}; background-image: none;`;

  const utilityClassDefs = [
    `.bg-(--brand-bg) { /* getPrimaryBrandCssVars({ bg: 'var(--brand-bg)' }) + background-image: none — do not set background-color */ ${brandBgUtilityDeclarations} }`,
    '.text-(--brand-text) { color: var(--brand-text); }',
    '.text-(--brand-color) { color: var(--brand-color); }',
  ];

  const brandBgGlobalClassRule = `:global(.bg-\\(--brand-bg\\)) { ${brandBgUtilityDeclarations} }`;

  let brandBg = $state('#e6c85b');
  let brandText = $state('#FFFFFF');
  let brandColor = $state('#FFFFFF');

  const brandVarsStyle = $derived(
    `--brand-bg: ${brandBg}; --brand-text: ${brandText}; --brand-color: ${brandColor};`,
  );

  const disabledCtaBrandBg = '#6c5ce7';
  const disabledCtaEnabledTokens = getPrimaryBrandCssVars({ bg: disabledCtaBrandBg });
  const disabledCtaDisabledTokens = {
    ...disabledCtaEnabledTokens,
    '--interactive-text-primary-disabled': '#9b92c4',
    '--interactive-icon-primary-disabled': '#9b92c4',
  };
  const disabledCtaEnabledStyle = cssVariablesToInlineStyle(disabledCtaEnabledTokens);
  const disabledCtaDisabledStyle = cssVariablesToInlineStyle(disabledCtaDisabledTokens);

  type StyleOverrideDemoState = {
    label: string;
    variant?: 'primary' | 'secondary' | 'tertiary';
    color?: 'primary' | 'white' | 'positive' | 'negative';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingType?: 'indefinite' | 'definite';
    loadingTimer?: number;
    withIcon?: boolean;
    iconOnly?: boolean;
    needsDarkBg?: boolean;
  };

  const styleOverrideDemoStates: StyleOverrideDemoState[] = [
    { label: 'Primary', variant: 'primary' },
    { label: 'Secondary', variant: 'secondary' },
    { label: 'Tertiary', variant: 'tertiary' },
    { label: 'Positive', color: 'positive' },
    { label: 'Negative', color: 'negative' },
    { label: 'White', color: 'white', needsDarkBg: true },
    { label: 'Disabled', isDisabled: true },
    { label: 'Indefinite loading', isLoading: true, loadingType: 'indefinite' },
    { label: 'Definite loading', loadingType: 'definite', loadingTimer: 3000 },
    { label: 'With icon', withIcon: true },
    { label: 'Icon only', withIcon: true, iconOnly: true },
    { label: 'XSmall', size: 'xsmall' },
    { label: 'Small', size: 'small' },
    { label: 'Medium', size: 'medium' },
    { label: 'Large', size: 'large' },
  ];
</script>

<!-- Playground story - auto-renders Button with args -->
<Story name="Playground" />

<!-- Additional stories with specific args -->
<Story name="Primary" args={{ children: 'Primary Button', variant: 'primary' }} />

<Story name="Secondary" args={{ children: 'Secondary Button', variant: 'secondary' }} />

<Story name="Tertiary" args={{ children: 'Tertiary Button', variant: 'tertiary' }} />

<!-- Indefinite loading: 3-dot loader replaces all content -->
<Story
  name="Indefinite Loading"
  args={{ children: 'Loading...', isLoading: true, loadingType: 'indefinite' }}
/>

<Story name="Indefinite Loading Sizes" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button size="xsmall" isLoading loadingType="indefinite">Pay Now</Button>
    <Button size="small" isLoading loadingType="indefinite">Pay Now</Button>
    <Button size="medium" isLoading loadingType="indefinite">Pay Now</Button>
    <Button size="large" isLoading loadingType="indefinite">Pay Now</Button>
  </div>
</Story>

<Story name="Indefinite Loading Variants" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button variant="primary" isLoading loadingType="indefinite">Primary</Button>
    <Button variant="secondary" isLoading loadingType="indefinite">Secondary</Button>
    <Button variant="tertiary" isLoading loadingType="indefinite">Tertiary</Button>
  </div>
</Story>

<!-- Definite loading: left-to-right progress overlay, content stays visible -->
<Story
  name="Definite Loading"
  args={{
    children: 'Processing',
    loadingType: 'definite',
    loadingTimer: 3000,
    size: 'large',
  }}
/>

<Story name="Definite Loading Variants" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button variant="primary" loadingType="definite" loadingTimer={3000}>Primary</Button>
    <Button variant="primary" color="positive" loadingType="definite" loadingTimer={3000}>
      Positive
    </Button>
    <Button variant="primary" color="negative" loadingType="definite" loadingTimer={3000}>
      Negative
    </Button>
  </div>
</Story>

<Story name="Definite Loading With Complete Callback" asChild>
  <Button
    size="large"
    loadingType="definite"
    loadingTimer={2500}
    onLoadingComplete={() => window.alert('Loading complete!')}
  >
    Complete in 2.5s
  </Button>
</Story>

<Story name="Disabled" args={{ children: 'Disabled Button', isDisabled: true }} />

<Story name="Full Width" args={{ children: 'Full Width Button', isFullWidth: true }} />

<!-- Icon Stories -->
<Story name="With Icon Left" asChild>
  <Button icon={SearchIcon} iconPosition="left">Search</Button>
</Story>

<Story name="With Icon Right" asChild>
  <Button icon={CloseIcon} iconPosition="right">Close</Button>
</Story>

<Story name="Icon Only" asChild>
  <Button icon={SearchIcon} accessibilityLabel="Search" />
</Story>

<Story name="Icon Variants" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button icon={SearchIcon} variant="primary">Primary</Button>
    <Button icon={SearchIcon} variant="secondary">Secondary</Button>
    <Button icon={SearchIcon} variant="tertiary">Tertiary</Button>
  </div>
</Story>

<Story name="Icon Sizes" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button icon={SearchIcon} size="xsmall">XSmall</Button>
    <Button icon={SearchIcon} size="small">Small</Button>
    <Button icon={SearchIcon} size="medium">Medium</Button>
    <Button icon={SearchIcon} size="large">Large</Button>
  </div>
</Story>

<Story name="Icon Only Sizes" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <div class="display-flex flex-col items-center gap-spacing-2">
      <Button icon={CloseIcon} size="xsmall" accessibilityLabel="Close" />
      <Text size="xsmall" color="surface.text.gray.muted">xsmall</Text>
    </div>
    <div class="display-flex flex-col items-center gap-spacing-2">
      <Button icon={CloseIcon} size="small" accessibilityLabel="Close" />
      <Text size="xsmall" color="surface.text.gray.muted">small</Text>
    </div>
    <div class="display-flex flex-col items-center gap-spacing-2">
      <Button icon={CloseIcon} size="medium" accessibilityLabel="Close" />
      <Text size="xsmall" color="surface.text.gray.muted">medium</Text>
    </div>
    <div class="display-flex flex-col items-center gap-spacing-2">
      <Button icon={CloseIcon} size="large" accessibilityLabel="Close" />
      <Text size="xsmall" color="surface.text.gray.muted">large</Text>
    </div>
  </div>
</Story>

<!-- Avatar group renders after the text, only on large buttons -->
<Story name="With Avatar Group" args={{ children: 'Shared with', size: 'large', avatars: sampleAvatars }} />

<Story name="Avatar Group With Icon" asChild>
  <Button size="large" icon={SearchIcon} iconPosition="left" avatars={sampleAvatars}>
    Reviewers
  </Button>
</Story>

<Story name="Avatar Group Ignored Below Large" asChild>
  <div class="display-flex flex-col gap-spacing-4 items-start">
    <Button size="medium" avatars={sampleAvatars}>Medium (avatars hidden)</Button>
    <Button size="large" avatars={sampleAvatars}>Large (avatars shown)</Button>
  </div>
</Story>

{#snippet styleOverrideStateColumn(
  title: string,
  override: StyleOverride<ButtonSlot> | undefined,
)}
  <div class="display-flex flex-col items-stretch gap-spacing-4" style="flex: 1; min-width: 200px;">
    <Text size="small" weight="semibold">{title}</Text>
    {#each styleOverrideDemoStates as state (state.label)}
      <div
        class="display-flex flex-col items-start gap-spacing-2"
        style={state.needsDarkBg
          ? 'padding: var(--spacing-3); border-radius: var(--border-radius-medium); background: var(--surface-background-gray-intense);'
          : undefined}
      >
        <Text
          size="xsmall"
          color={state.needsDarkBg ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted'}
        >
          {state.label}
        </Text>
        {#if state.iconOnly}
          <Button
            icon={SearchIcon}
            accessibilityLabel="Search"
            variant={state.variant}
            color={state.color}
            size={state.size}
            isDisabled={state.isDisabled}
            isLoading={state.isLoading}
            loadingType={state.loadingType}
            loadingTimer={state.loadingTimer}
            styleOverride={override}
          />
        {:else if state.withIcon}
          <Button
            icon={SearchIcon}
            variant={state.variant}
            color={state.color}
            size={state.size}
            isDisabled={state.isDisabled}
            isLoading={state.isLoading}
            loadingType={state.loadingType}
            loadingTimer={state.loadingTimer}
            styleOverride={override}
          >
            Pay Now
          </Button>
        {:else}
          <Button
            variant={state.variant}
            color={state.color}
            size={state.size}
            isDisabled={state.isDisabled}
            isLoading={state.isLoading}
            loadingType={state.loadingType}
            loadingTimer={state.loadingTimer}
            styleOverride={override}
          >
            Pay Now
          </Button>
        {/if}
      </div>
    {/each}
  </div>
{/snippet}

<Story name="Style Override Playground" asChild>
  <div class="display-flex flex-col gap-spacing-6 items-start" style="width: min(100%, 720px);">
    <Heading size="small" weight="semibold">Fixed styleOverride with CSS variables</Heading>

    <div class="display-flex flex-wrap items-center gap-spacing-1">
      <Text size="small" color="surface.text.gray.muted">
        Button uses a fixed styleOverride with utility classes that read CSS variables. Change the
        variable values below — utilities like
      </Text>
      <Code size="small" isHighlighted={false}>text-(--brand-color)</Code>
      <Text size="small" color="surface.text.gray.muted">resolve at runtime.</Text>
    </div>

    <div class="display-flex flex-col gap-spacing-2" style="width: 100%;">
      <Heading size="small" weight="medium">styleOverride prop</Heading>
      <Code size="small" isHighlighted={false}>{styleOverrideSnippet}</Code>
    </div>

    <div class="display-flex flex-col gap-spacing-2" style="width: 100%;">
      <Heading size="small" weight="medium">Utility class definitions</Heading>
      {#each utilityClassDefs as classDef (classDef)}
        <Code size="small" isHighlighted={false}>{classDef}</Code>
      {/each}
    </div>

    <div class="display-flex flex-col gap-spacing-3" style="width: min(100%, 360px);">
      <Heading size="small" weight="medium">CSS variables</Heading>
      <label class="display-flex items-center gap-spacing-3">
        <Text size="small" weight="medium">--brand-bg</Text>
        <input type="color" bind:value={brandBg} aria-label="--brand-bg" />
        <Code size="small" isHighlighted={false}>{brandBg}</Code>
      </label>
      <label class="display-flex items-center gap-spacing-3">
        <Text size="small" weight="medium">--brand-text</Text>
        <input type="color" bind:value={brandText} aria-label="--brand-text" />
        <Code size="small" isHighlighted={false}>{brandText}</Code>
      </label>
      <label class="display-flex items-center gap-spacing-3">
        <Text size="small" weight="medium">--brand-color</Text>
        <input type="color" bind:value={brandColor} aria-label="--brand-color" />
        <Code size="small" isHighlighted={false}>{brandColor}</Code>
      </label>
    </div>

    <div class="display-flex flex-wrap items-start gap-spacing-8" style="width: 100%; {brandVarsStyle}">
      {@render styleOverrideStateColumn('Default (no styleOverride)', undefined)}
      {@render styleOverrideStateColumn('With styleOverride', styleOverride)}
    </div>
  </div>
</Story>

<Story
  name="Disabled CTA token override"
  parameters={{
    docs: {
      description: {
        story:
          'Override the primary disabled fill cluster plus `--interactive-text-primary-disabled` / `--interactive-icon-primary-disabled` on an ancestor. `getButtonTextColorToken` reads those paths when `isDisabled`. Hover does not apply while disabled.',
      },
    },
  }}
  asChild
>
  <div class="display-flex flex-col gap-spacing-4 items-start">
    <Text size="small" weight="medium">Default — hover updates fill</Text>
    <div style={disabledCtaEnabledStyle}>
      <Button styleOverride={{ root: 'token-override-shell' }}>Pay Now</Button>
    </div>
    <Text size="small" weight="medium">Disabled — muted fill and text; hover unchanged</Text>
    <div style={disabledCtaDisabledStyle}>
      <Button isDisabled styleOverride={{ root: 'token-override-shell' }}>Pay Now</Button>
    </div>
  </div>
</Story>

<svelte:head>
  {@html `<style>${brandBgGlobalClassRule}</style>`}
</svelte:head>

<style>
  :global(.token-override-shell) {
    background-image: none;
  }

  :global(.text-\(--brand-text\)) {
    color: var(--brand-text);
  }

  :global(.text-\(--brand-color\)) {
    color: var(--brand-color);
  }
</style>

