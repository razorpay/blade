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
      loadingType: 'indefinite',
      loadingTimer: undefined,
      avatars: undefined,
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
        description: 'Controls loading behaviour: 3-dot spinner (indefinite) or timed progress overlay (definite)',
        table: {
          defaultValue: { summary: 'indefinite' },
        },
      },
      loadingTimer: {
        control: 'number',
        description: 'Duration in ms for the definite progress fill. Required when loadingType is "definite".',
      },
      avatars: {
        control: 'object',
        description: 'Avatar data array rendered as an AvatarGroup after button text (large size only)',
      },
    },
  });
</script>

<script>
  // Button is already imported in the module context
</script>

<!-- Playground story - auto-renders Button with args -->
<Story name="Playground" />

<!-- Additional stories with specific args -->
<Story name="Primary" args={{ children: 'Primary Button', variant: 'primary' }} />

<Story name="Secondary" args={{ children: 'Secondary Button', variant: 'secondary' }} />

<Story name="Tertiary" args={{ children: 'Tertiary Button', variant: 'tertiary' }} />

<Story name="Loading" args={{ children: 'Loading...', isLoading: true }} />

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

<!-- Loading stories -->
<Story name="Indefinite Loading" args={{ children: 'Processing', isLoading: true, loadingType: 'indefinite' }} />

<Story name="Definite Loading" asChild>
  <Button
    size="large"
    loadingType="definite"
    loadingTimer={3000}
    onLoadingComplete={() => console.log('Loading complete!')}
  >
    Uploading
  </Button>
</Story>

<Story name="Definite Loading Variants" asChild>
  <div class="display-flex gap-spacing-4 items-center">
    <Button size="large" loadingType="definite" loadingTimer={3000} color="primary">Primary</Button>
    <Button size="large" loadingType="definite" loadingTimer={5000} color="positive">Positive</Button>
    <Button size="large" loadingType="definite" loadingTimer={4000} color="negative">Negative</Button>
  </div>
</Story>

<!-- Avatar group stories -->
<Story name="With Avatar Group" asChild>
  <Button
    size="large"
    avatars={[
      { name: 'Anurag Hazra', src: 'https://avatars.githubusercontent.com/u/46647141?v=4' },
      { name: 'Rama Krushna' },
      { name: 'Kamlesh Chandnani' },
    ]}
  >
    Assignees
  </Button>
</Story>

<Story name="Avatar Group Hidden On Non-Large" asChild>
  <div class="display-flex flex-col gap-spacing-4">
    <Text size="small" color="surface.text.gray.muted">Avatars only visible at size=large</Text>
    <div class="display-flex gap-spacing-4 items-center">
      <Button
        size="medium"
        avatars={[{ name: 'Anurag Hazra' }, { name: 'Rama Krushna' }]}
      >
        medium (no avatars)
      </Button>
      <Button
        size="large"
        avatars={[{ name: 'Anurag Hazra' }, { name: 'Rama Krushna' }]}
      >
        large (with avatars)
      </Button>
    </div>
  </div>
</Story>

