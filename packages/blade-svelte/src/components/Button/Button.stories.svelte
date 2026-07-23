<script context="module">
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
  let isDefiniteLoadingDemoActive = $state(false);

  function startDefiniteLoadingDemo(): void {
    if (isDefiniteLoadingDemoActive) return;
    isDefiniteLoadingDemoActive = true;
  }

  function handleDefiniteLoadingComplete(): void {
    console.log('Loading complete!');
    isDefiniteLoadingDemoActive = false;
  }
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
    loadingType={isDefiniteLoadingDemoActive ? 'definite' : 'indefinite'}
    loadingTimer={isDefiniteLoadingDemoActive ? 2500 : undefined}
    onClick={startDefiniteLoadingDemo}
    onLoadingComplete={handleDefiniteLoadingComplete}
  >
    {isDefiniteLoadingDemoActive ? 'Processing' : 'Complete in 2.5s'}
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

