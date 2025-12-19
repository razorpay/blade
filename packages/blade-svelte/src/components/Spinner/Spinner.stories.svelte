<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Spinner',
  });
</script>

<script>
  import Spinner from './BaseSpinner/BaseSpinner.svelte';
</script>

<Story name="Basic Spinner">
  <Spinner size="medium" color="neutral" accessibilityLabel="Loading content" />
</Story>

<Story name="Spinner Sizes">
  <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="small" color="neutral" accessibilityLabel="Small spinner" />
      <span>Small</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="medium" color="neutral" accessibilityLabel="Medium spinner" />
      <span>Medium</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="large" color="neutral" accessibilityLabel="Large spinner" />
      <span>Large</span>
    </div>
  </div>
</Story>

<Story name="Spinner Colors">
  <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap;">
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="medium" color="neutral" accessibilityLabel="Neutral spinner" />
      <span>Neutral</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="medium" color="primary" accessibilityLabel="Primary spinner" />
      <span>Primary</span>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
      <Spinner size="medium" color="white" accessibilityLabel="White spinner" />
      <span>White</span>
    </div>
  </div>
</Story>

<Story name="Spinner with Label - Right">
  <Spinner 
    size="medium" 
    color="neutral" 
    accessibilityLabel="Loading content"
    label="Loading..."
    labelPosition="right"
  />
</Story>

<Story name="Spinner with Label - Bottom">
  <Spinner 
    size="medium" 
    color="neutral" 
    accessibilityLabel="Loading content"
    label="Loading..."
    labelPosition="bottom"
  />
</Story>

<Story name="Spinner with Custom Label">
  <Spinner 
    size="medium" 
    color="primary" 
    accessibilityLabel="Processing payment"
    label="Processing your payment..."
    labelPosition="right"
  />
</Story>

