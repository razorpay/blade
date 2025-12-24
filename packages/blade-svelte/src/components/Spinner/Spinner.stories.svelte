<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Spinner from './BaseSpinner/BaseSpinner.svelte';
  
  const { Story } = defineMeta({
    title: 'Spinner',
    component: Spinner,
    tags: ['autodocs'],
    args: {
      size: 'medium',
      color: 'neutral',
      accessibilityLabel: 'Loading content',
      label: '',
      labelPosition: 'right',
    },
    argTypes: {
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'Size of the spinner',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      color: {
        control: 'select',
        options: ['neutral', 'primary', 'white', 'positive', 'negative'],
        description: 'Color of the spinner',
        table: {
          defaultValue: { summary: 'neutral' },
        },
      },
      accessibilityLabel: {
        control: 'text',
        description: 'Accessibility label for screen readers (required)',
      },
      label: {
        control: 'text',
        description: 'Optional visible label text',
      },
      labelPosition: {
        control: 'select',
        options: ['right', 'bottom'],
        description: 'Position of the label relative to the spinner',
        table: {
          defaultValue: { summary: 'right' },
        },
      },
    },
  });
</script>

<script>
  // Spinner is already imported in the module context
</script>

<!-- Playground story with all controls -->
<Story name="Playground" />

<Story name="Basic Spinner" args={{ size: 'medium', color: 'neutral', accessibilityLabel: 'Loading content' }} />

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
    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: #333; padding: 1rem; border-radius: 4px;">
      <Spinner size="medium" color="white" accessibilityLabel="White spinner" />
      <span style="color: white;">White</span>
    </div>
  </div>
</Story>

<Story name="Spinner with Label - Right" args={{ size: 'medium', color: 'neutral', accessibilityLabel: 'Loading content', label: 'Loading...', labelPosition: 'right' }} />

<Story name="Spinner with Label - Bottom" args={{ size: 'medium', color: 'neutral', accessibilityLabel: 'Loading content', label: 'Loading...', labelPosition: 'bottom' }} />
