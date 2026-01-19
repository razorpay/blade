<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Indicator from './Indicator.svelte';

  const { Story } = defineMeta({
    title: 'Components/Indicator',
    component: Indicator,
    tags: ['autodocs'],
    args: {
      accessibilityLabel: 'Status OK',
      children: 'Success',
      color: 'neutral',
      size: 'medium',
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Optional text label to show alongside the indicator',
      },
      color: {
        control: 'select',
        options: ['primary', 'information', 'negative', 'neutral', 'notice', 'positive'],
        description: 'Sets the color tone',
        table: {
          defaultValue: { summary: 'neutral' },
        },
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'Sets the emphasis of the indicator (intense shows background circle)',
        table: {
          defaultValue: { summary: 'subtle' },
        },
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'Size of the indicator',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      accessibilityLabel: {
        control: 'text',
        description: 'Accessibility label for screen readers',
      },
    },
  });
</script>

<!-- Default: Interactive story with controls, shows label "Success" -->
<Story name="Default" />

<!-- Without Label: No children, only accessibilityLabel -->
<Story name="Without Label" args={{ children: undefined, accessibilityLabel: 'Success' }} />

<!-- With Intense Emphasis: Shows "Success" label with intense emphasis (dual circles) -->
<Story name="With Intense Emphasis" args={{ children: 'Success', emphasis: 'intense' }} />
