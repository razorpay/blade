<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  
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
      iconPosition: {
        control: 'select',
        options: ['left', 'right'],
        description: 'Position of the icon relative to the button text',
        table: {
          defaultValue: { summary: 'left' },
        },
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


