<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Badge from './Badge.svelte';

  const { Story } = defineMeta({
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
      children: {
        control: 'text',
        description: 'The text content of the badge',
      },
      color: {
        control: 'select',
        options: ['neutral', 'positive', 'negative', 'notice', 'information', 'primary'],
        description: 'The color variant of the badge',
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'The emphasis (contrast) of the badge',
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
        description: 'The size of the badge',
      },
      testID: {
        control: 'text',
        description: 'Test ID for the badge element',
      },
    },
    args: {
      children: 'Badge',
      color: 'neutral',
      emphasis: 'subtle',
      size: 'medium',
    },
  });
</script>

<script lang="ts">
  const sizes = ['xsmall', 'small', 'medium', 'large'] as const;
  const colors = ['neutral', 'positive', 'negative', 'notice', 'information', 'primary'] as const;
</script>

<!-- Playground story - auto-renders Badge with args -->
<Story name="Playground" />

<!-- All Badge Sizes -->
<Story name="Sizes" asChild>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    {#each sizes as size}
      <Badge {size}>{size}</Badge>
    {/each}
  </div>
</Story>

<!-- All Badge Colors - Subtle Emphasis -->
<Story name="Subtle Emphasis" asChild>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    {#each colors as color}
      <Badge {color} emphasis="subtle">{color}</Badge>
    {/each}
  </div>
</Story>

<!-- All Badge Colors - Intense Emphasis -->
<Story name="Intense Emphasis" asChild>
  <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
    {#each colors as color}
      <Badge {color} emphasis="intense">{color}</Badge>
    {/each}
  </div>
</Story>

<!-- Badge with Long Text (Truncation) -->
<Story name="Truncation" asChild>
  <div style="max-width: 200px;">
    <Badge>This is a very long badge text that should truncate</Badge>
  </div>
</Story>
