<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Spinner from './BaseSpinner/BaseSpinner.svelte';
  import Text from '../Typography/Text/Text.svelte'
  
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
        options: ['medium', 'large', 'xlarge'],
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

<Story name="Spinner Label" asChild>
  <div class='display-flex margin-x-spacing-8 gap-spacing-4 flex-wrap'>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner size="medium" color="neutral" accessibilityLabel="Small spinner" label="loading" />
    </div>
  </div>
</Story>

<Story name="Spinner Sizes" asChild>
  <div class='display-flex gap-spacing-4 flex-wrap'>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner size="medium" color="neutral" accessibilityLabel="Small spinner" />
      <Text>Medium</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner size="large" color="neutral" accessibilityLabel="Medium spinner" />
      <Text>Large</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner size="xlarge" color="neutral" accessibilityLabel="Large spinner" />
      <Text size='large'>X Large</Text>
    </div>
  </div>
</Story>

<Story name="Spinner Colors" asChild>
  <div class='display-flex gap-spacing-4 items-center flex-wrap'>
    <div class="display-flex flex-col gap-spacing-2">
      <Spinner size="medium" color="neutral" accessibilityLabel="Neutral spinner" />
      <Text>Neutral</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2">
      <Spinner size="medium" color="primary" accessibilityLabel="Primary spinner" />
      <Text color='surface.text.primary.normal'>Primary</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2">
      <Spinner size="medium" color="positive" accessibilityLabel="Positive spinner" />
      <Text color='feedback.text.positive.intense'>Positive</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2">
      <Spinner size="medium" color="negative" accessibilityLabel="Negative spinner" />
      <Text color='feedback.text.negative.intense'>Negative</Text>
    </div>
    <div class="display-flex flex-col gap-spacing-2" style="background: #333; padding: 1rem; border-radius: 4px;">
      <Spinner size="medium" color="white" accessibilityLabel="White spinner" />
      <Text color='surface.text.staticWhite.normal'>White</Text>
    </div>
  </div>
</Story>

<Story name="Spinner Label - Right" asChild>
  <div class='display-flex margin-x-spacing-8 gap-spacing-4 flex-wrap'>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner size="medium" color="neutral" accessibilityLabel="Small spinner" label="Loading..." />
    </div>
  </div>
</Story>

<Story name="Spinner Label - Bottom" asChild>
  <div class='display-flex margin-x-spacing-8 gap-spacing-4 flex-wrap'>
    <div class="display-flex flex-col gap-spacing-2 items-center">
      <Spinner labelPosition='bottom' size="medium" color="neutral" accessibilityLabel="Small spinner" label="Loading..." />
    </div>
  </div>
</Story>