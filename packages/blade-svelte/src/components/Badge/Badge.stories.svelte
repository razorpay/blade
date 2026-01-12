<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Badge from './Badge.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    args: {
      children: 'Badge',
      color: 'neutral',
      emphasis: 'subtle',
      size: 'medium',
    },
    argTypes: {
      children: {
        control: 'text',
        description: 'Badge text content',
        table: {
          defaultValue: { summary: 'Badge' },
        },
      },
      color: {
        control: 'select',
        options: ['neutral', 'information', 'negative', 'notice', 'positive', 'primary'],
        description: 'Color of the badge',
        table: {
          defaultValue: { summary: 'neutral' },
        },
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'Contrast level of the badge',
        table: {
          defaultValue: { summary: 'subtle' },
        },
      },
      size: {
        control: 'select',
        options: ['xsmall', 'small', 'medium', 'large'],
        description: 'Size of the badge',
        table: {
          defaultValue: { summary: 'medium' },
        },
      },
      testID: {
        control: 'text',
        description: 'Test ID for testing',
      },
    },
  });
</script>

<script>
  // Badge is already imported in the module context
</script>

<!-- Playground story - auto-renders Badge with args -->
<Story name="Playground" />

<!-- Size Variants -->
<Story name="Size XSmall" args={{ children: 'XSmall', size: 'xsmall' }} />

<Story name="Size Small" args={{ children: 'Small', size: 'small' }} />

<Story name="Size Medium" args={{ children: 'Medium', size: 'medium' }} />

<Story name="Size Large" args={{ children: 'Large', size: 'large' }} />

<!-- Color Variants - Subtle Emphasis -->
<Story name="Neutral Subtle" args={{ children: 'Neutral', color: 'neutral', emphasis: 'subtle' }} />

<Story name="Information Subtle" args={{ children: 'Information', color: 'information', emphasis: 'subtle' }} />

<Story name="Negative Subtle" args={{ children: 'Negative', color: 'negative', emphasis: 'subtle' }} />

<Story name="Notice Subtle" args={{ children: 'Notice', color: 'notice', emphasis: 'subtle' }} />

<Story name="Positive Subtle" args={{ children: 'Positive', color: 'positive', emphasis: 'subtle' }} />

<Story name="Primary Subtle" args={{ children: 'Primary', color: 'primary', emphasis: 'subtle' }} />

<!-- Color Variants - Intense Emphasis -->
<Story name="Neutral Intense" args={{ children: 'Neutral', color: 'neutral', emphasis: 'intense' }} />

<Story name="Information Intense" args={{ children: 'Information', color: 'information', emphasis: 'intense' }} />

<Story name="Negative Intense" args={{ children: 'Negative', color: 'negative', emphasis: 'intense' }} />

<Story name="Notice Intense" args={{ children: 'Notice', color: 'notice', emphasis: 'intense' }} />

<Story name="Positive Intense" args={{ children: 'Positive', color: 'positive', emphasis: 'intense' }} />

<Story name="Primary Intense" args={{ children: 'Primary', color: 'primary', emphasis: 'intense' }} />

<!-- Text Truncation -->
<Story name="Long Text Truncation" args={{ children: 'This is a very long badge text that should be truncated with ellipsis after exceeding the maximum width', size: 'medium' }} />

<Story name="Short Text" args={{ children: 'OK', size: 'medium' }} />

<!-- Styled Props Examples -->
<Story name="With Margin" args={{ children: 'Margin', marginX: 'spacing.5', marginY: 'spacing.3' }} />

<Story name="With Position" args={{ children: 'Positioned', position: 'relative', top: 'spacing.2' }} />

<Story name="With Display" args={{ children: 'Display Block', display: 'block' }} />

<!-- Accessibility & Testing -->
<Story name="With Test ID" args={{ children: 'Test Badge', testID: 'badge-test-id' }} />

<Story name="With Analytics" args={{ children: 'Analytics', 'data-analytics-section': 'header', 'data-analytics-action': 'view' }} />

<!-- Size Combinations -->
<Story name="All Sizes - Primary Intense" 
  render={(args) => `
    <div style="display: flex; gap: 12px; align-items: center;">
      <Badge size="xsmall" color="primary" emphasis="intense">XSmall</Badge>
      <Badge size="small" color="primary" emphasis="intense">Small</Badge>
      <Badge size="medium" color="primary" emphasis="intense">Medium</Badge>
      <Badge size="large" color="primary" emphasis="intense">Large</Badge>
    </div>
  `}
/>

<Story name="All Colors - Subtle" 
  render={(args) => `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <Badge color="neutral" emphasis="subtle">Neutral</Badge>
      <Badge color="information" emphasis="subtle">Information</Badge>
      <Badge color="negative" emphasis="subtle">Negative</Badge>
      <Badge color="notice" emphasis="subtle">Notice</Badge>
      <Badge color="positive" emphasis="subtle">Positive</Badge>
      <Badge color="primary" emphasis="subtle">Primary</Badge>
    </div>
  `}
/>

<Story name="All Colors - Intense" 
  render={(args) => `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <Badge color="neutral" emphasis="intense">Neutral</Badge>
      <Badge color="information" emphasis="intense">Information</Badge>
      <Badge color="negative" emphasis="intense">Negative</Badge>
      <Badge color="notice" emphasis="intense">Notice</Badge>
      <Badge color="positive" emphasis="intense">Positive</Badge>
      <Badge color="primary" emphasis="intense">Primary</Badge>
    </div>
  `}
/>

