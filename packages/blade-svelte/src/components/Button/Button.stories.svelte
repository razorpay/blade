<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  
  const { Story } = defineMeta({
    title: 'Button',
  });
</script>

<script>
  import Button from './Button.svelte';
</script>

<Story name="Primary Button">
  <Button 
    variant="primary"
    size="medium"
    onClick={() => alert('Button clicked!')}
  >
    Click me
  </Button>
</Story>

<Story name="Secondary Button">
  <Button 
    variant="secondary"
    size="medium"
    onClick={() => alert('Button clicked!')}
  >
    Secondary
  </Button>
</Story>

<Story name="Tertiary Button">
  <Button 
    variant="tertiary"
    size="medium"
    onClick={() => alert('Button clicked!')}
  >
    Tertiary
  </Button>
</Story>

<Story name="Button Sizes">
  <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
    <Button variant="primary" size="xsmall" onClick={() => alert('xsmall clicked')}>XSmall</Button>
    <Button variant="primary" size="small" onClick={() => alert('small clicked')}>Small</Button>
    <Button variant="primary" size="medium" onClick={() => alert('medium clicked')}>Medium</Button>
    <Button variant="primary" size="large" onClick={() => alert('large clicked')}>Large</Button>
  </div>
</Story>

<Story name="Button Colors">
  <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
    <Button variant="primary" color="primary" onClick={() => alert('primary clicked')}>Primary</Button>
    <Button variant="primary" color="positive" onClick={() => alert('positive clicked')}>Positive</Button>
    <Button variant="primary" color="negative" onClick={() => alert('negative clicked')}>Negative</Button>
    <Button variant="primary" color="white" onClick={() => alert('white clicked')}>White</Button>
  </div>
</Story>

<Story name="Disabled Button">
  <Button 
    variant="primary"
    size="medium"
    isDisabled={true}
    onClick={() => alert('This should not fire')}
  >
    Disabled Button
  </Button>
</Story>

<Story name="Loading Button">
  <Button 
    variant="primary"
    size="medium"
    isLoading={true}
    onClick={() => alert('This should not fire while loading')}
  >
    Loading...
  </Button>
</Story>

<Story name="Full Width Button">
  <div style="width: 100%">
    <Button 
      variant="primary"
      size="medium"
      isFullWidth={true}
      onClick={() => alert('Full width button clicked!')}
      >
      Full Width Button
    </Button>
  </div>
</Story>
