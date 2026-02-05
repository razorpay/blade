<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Counter from './Counter.svelte';

  const { Story } = defineMeta({
    title: 'Components/Counter',
    component: Counter,
    args: {
      value: 20,
      color: 'neutral',
      emphasis: 'subtle',
      size: 'medium',
    },
    argTypes: {
      value: {
        control: { type: 'number' },
        description: 'Sets the value for the counter',
        table: {
          type: { summary: 'number' },
          defaultValue: { summary: '20' },
        },
      },
      max: {
        control: { type: 'number' },
        description: 'Sets the max value for the counter. If value exceeds max it will render "max+"',
        table: {
          type: { summary: 'number' },
        },
      },
      color: {
        control: { type: 'select' },
        options: ['neutral', 'positive', 'negative', 'notice', 'information', 'primary'],
        description: 'Sets the color of the counter',
        table: {
          type: { summary: 'FeedbackColors | "primary"' },
          defaultValue: { summary: 'neutral' },
        },
      },
      emphasis: {
        control: { type: 'select' },
        options: ['subtle', 'intense'],
        description: 'Sets the contrast of the counter',
        table: {
          type: { summary: 'SubtleOrIntense' },
          defaultValue: { summary: 'subtle' },
        },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Sets the size of the counter',
        table: {
          type: { summary: '"small" | "medium" | "large"' },
          defaultValue: { summary: 'medium' },
        },
      },
      testID: {
        control: { type: 'text' },
        description: 'Test ID for the counter element',
        table: {
          type: { summary: 'string' },
        },
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
