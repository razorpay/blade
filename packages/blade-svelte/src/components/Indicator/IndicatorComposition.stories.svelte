<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Indicator from './Indicator.svelte';
  import Button from '../Button/Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Indicator/Composition',
    tags: ['autodocs'],
  });
</script>

<!-- Composition: Indicator positioned absolutely on a Button -->
<Story name="With Button">
  <div style="position: relative; display: inline-flex;">
    <Button>Get started</Button>
    <Indicator
      color="notice"
      size="large"
      accessibilityLabel="New offers"
      style="position: absolute; top: -4px; left: -4px; z-index: 10;"
    />
  </div>
</Story>

