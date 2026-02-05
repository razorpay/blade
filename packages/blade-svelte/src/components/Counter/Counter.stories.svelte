<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Counter from './Counter.svelte';

  const { Story } = defineMeta({
    title: 'Components/Counter',
    component: Counter,
    tags: ['autodocs'],
    args: {
      value: 20,
      color: 'neutral',
      emphasis: 'subtle',
      size: 'medium',
    },
    argTypes: {
      value: {
        control: { type: 'number' },
        description: 'The numerical value to display in the counter',
      },
      max: {
        control: { type: 'number' },
        description: 'Maximum value. If value exceeds max, displays "max+"',
      },
      color: {
        control: { type: 'select' },
        options: ['neutral', 'positive', 'negative', 'notice', 'information', 'primary'],
        description: 'Color theme of the counter',
      },
      emphasis: {
        control: { type: 'select' },
        options: ['subtle', 'intense'],
        description: 'Background intensity - subtle or intense',
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Size of the counter',
      },
    },
  });
</script>

<script lang="ts">
  const colors = ['positive', 'negative', 'notice', 'information', 'neutral', 'primary'] as const;
</script>

<!-- Default story - matches React "Default" story with Playground controls -->
<Story name="Default" />

<!-- Max value story - matches React "Max" story -->
<Story name="Max" asChild>
  <Counter value={120} max={99} color="neutral" emphasis="intense" />
</Story>

<!-- Small Size with all colors - matches React "Small Size" story -->
<Story name="Small Size" asChild>
  <div style="display: flex; flex-direction: column;">
    <strong>Subtle Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="small" {color} emphasis="subtle" />
      {/each}
    </div>
    <strong>Intense Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="small" {color} emphasis="intense" />
      {/each}
    </div>
  </div>
</Story>

<!-- Medium Size with all colors - matches React "Medium Size" story -->
<Story name="Medium Size" asChild>
  <div style="display: flex; flex-direction: column;">
    <strong>Subtle Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="medium" {color} emphasis="subtle" />
      {/each}
    </div>
    <strong>Intense Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="medium" {color} emphasis="intense" />
      {/each}
    </div>
  </div>
</Story>

<!-- Large Size with all colors - matches React "Large Size" story -->
<Story name="Large Size" asChild>
  <div style="display: flex; flex-direction: column;">
    <strong>Subtle Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="large" {color} emphasis="subtle" />
      {/each}
    </div>
    <strong>Intense Emphasis</strong>
    <div
      style="display: flex; flex-direction: row; padding-top: 12px; padding-bottom: 20px; flex-wrap: wrap; gap: 8px;"
    >
      {#each colors as color}
        <Counter value={20} size="large" {color} emphasis="intense" />
      {/each}
    </div>
  </div>
</Story>
