<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Counter from './Counter.svelte';
  
  const { Story } = defineMeta({
    title: 'Components/Counter',
    component: Counter,
    tags: ['autodocs'],
    args: {
      value: 5,
      color: 'neutral',
      emphasis: 'subtle',
      size: 'medium',
    },
    argTypes: {
      value: {
        control: 'number',
        description: 'The counter value to display',
        table: {
          type: { summary: 'number' },
        },
      },
      max: {
        control: 'number',
        description: 'Maximum value. If value exceeds max, displays "max+"',
        table: {
          type: { summary: 'number' },
        },
      },
      color: {
        control: 'select',
        options: ['neutral', 'information', 'negative', 'notice', 'positive', 'primary'],
        description: 'Color of the counter',
        table: {
          defaultValue: { summary: 'neutral' },
        },
      },
      emphasis: {
        control: 'select',
        options: ['subtle', 'intense'],
        description: 'Contrast level of the counter',
        table: {
          defaultValue: { summary: 'subtle' },
        },
      },
      size: {
        control: 'select',
        options: ['small', 'medium', 'large'],
        description: 'Size of the counter',
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
  // Counter is already imported in the module context
</script>

<!-- Playground story - auto-renders Counter with args -->
<Story name="Playground" />

<!-- Basic Usage -->
<Story name="Default" args={{ value: 5 }} />

<Story name="With Max Value" args={{ value: 15, max: 10 }} />

<Story name="Below Max Value" args={{ value: 8, max: 10 }} />

<Story name="Zero Value" args={{ value: 0 }} />

<Story name="Large Number" args={{ value: 9999 }} />

<!-- Size Variants -->
<Story name="Size Small" args={{ value: 5, size: 'small' }} />

<Story name="Size Medium" args={{ value: 5, size: 'medium' }} />

<Story name="Size Large" args={{ value: 5, size: 'large' }} />

<!-- Color Variants - Subtle Emphasis -->
<Story name="Neutral Subtle" args={{ value: 5, color: 'neutral', emphasis: 'subtle' }} />

<Story name="Information Subtle" args={{ value: 5, color: 'information', emphasis: 'subtle' }} />

<Story name="Negative Subtle" args={{ value: 5, color: 'negative', emphasis: 'subtle' }} />

<Story name="Notice Subtle" args={{ value: 5, color: 'notice', emphasis: 'subtle' }} />

<Story name="Positive Subtle" args={{ value: 5, color: 'positive', emphasis: 'subtle' }} />

<Story name="Primary Subtle" args={{ value: 5, color: 'primary', emphasis: 'subtle' }} />

<!-- Color Variants - Intense Emphasis -->
<Story name="Neutral Intense" args={{ value: 5, color: 'neutral', emphasis: 'intense' }} />

<Story name="Information Intense" args={{ value: 5, color: 'information', emphasis: 'intense' }} />

<Story name="Negative Intense" args={{ value: 5, color: 'negative', emphasis: 'intense' }} />

<Story name="Notice Intense" args={{ value: 5, color: 'notice', emphasis: 'intense' }} />

<Story name="Positive Intense" args={{ value: 5, color: 'positive', emphasis: 'intense' }} />

<Story name="Primary Intense" args={{ value: 5, color: 'primary', emphasis: 'intense' }} />

<!-- Max Value Scenarios -->
<Story name="Exactly At Max" args={{ value: 100, max: 100 }} />

<Story name="One Over Max" args={{ value: 101, max: 100 }} />

<Story name="Way Over Max" args={{ value: 999, max: 99 }} />

<Story name="Small Max Plus" args={{ value: 10, max: 9, size: 'small' }} />

<Story name="Large Max Plus" args={{ value: 50, max: 49, size: 'large' }} />

<!-- Number Truncation -->
<Story name="Very Long Number" args={{ value: 123456789, size: 'medium' }} />

<Story name="Very Long Number Max Plus" args={{ value: 123456789, max: 1000, size: 'medium' }} />

<!-- Styled Props Examples -->
<Story name="With Margin" args={{ value: 5, marginX: 'spacing.5', marginY: 'spacing.3' }} />

<Story name="With Position" args={{ value: 99, position: 'relative', top: 'spacing.2' }} />

<Story name="With Display" args={{ value: 10, display: 'block' }} />

<!-- Accessibility & Testing -->
<Story name="With Test ID" args={{ value: 5, testID: 'counter-test-id' }} />

<Story name="With Analytics" args={{ value: 5, 'data-analytics-section': 'header', 'data-analytics-action': 'view' }} />

<!-- Combination Stories -->
<Story name="All Sizes - Primary Intense" 
  render={(args) => `
    <div style="display: flex; gap: 12px; align-items: center;">
      <Counter value={5} size="small" color="primary" emphasis="intense" />
      <Counter value={5} size="medium" color="primary" emphasis="intense" />
      <Counter value={5} size="large" color="primary" emphasis="intense" />
    </div>
  `}
/>

<Story name="All Colors - Subtle" 
  render={(args) => `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <Counter value={5} color="neutral" emphasis="subtle" />
      <Counter value={5} color="information" emphasis="subtle" />
      <Counter value={5} color="negative" emphasis="subtle" />
      <Counter value={5} color="notice" emphasis="subtle" />
      <Counter value={5} color="positive" emphasis="subtle" />
      <Counter value={5} color="primary" emphasis="subtle" />
    </div>
  `}
/>

<Story name="All Colors - Intense" 
  render={(args) => `
    <div style="display: flex; flex-wrap: wrap; gap: 12px;">
      <Counter value={5} color="neutral" emphasis="intense" />
      <Counter value={5} color="information" emphasis="intense" />
      <Counter value={5} color="negative" emphasis="intense" />
      <Counter value={5} color="notice" emphasis="intense" />
      <Counter value={5} color="positive" emphasis="intense" />
      <Counter value={5} color="primary" emphasis="intense" />
    </div>
  `}
/>

<Story name="Max Value Showcase" 
  render={(args) => `
    <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <Counter value={5} max={10} color="primary" emphasis="subtle" />
        <span style="font-size: 12px;">5 of 10</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <Counter value={10} max={10} color="primary" emphasis="subtle" />
        <span style="font-size: 12px;">At max (10)</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <Counter value={15} max={10} color="primary" emphasis="subtle" />
        <span style="font-size: 12px;">Over max (15 > 10)</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
        <Counter value={999} max={99} color="negative" emphasis="intense" />
        <span style="font-size: 12px;">Way over (999 > 99)</span>
      </div>
    </div>
  `}
/>

<Story name="Real World Examples" 
  render={(args) => `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Notification Counter -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 14px;">Unread Messages:</span>
        <Counter value={15} max={99} color="negative" emphasis="intense" size="small" />
      </div>
      
      <!-- Items in Cart -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 14px;">Cart Items:</span>
        <Counter value={3} color="primary" emphasis="subtle" size="medium" />
      </div>
      
      <!-- Pending Approvals -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 14px;">Pending Approvals:</span>
        <Counter value={7} color="notice" emphasis="intense" size="medium" />
      </div>
      
      <!-- Success Count -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 14px;">Completed Tasks:</span>
        <Counter value={42} color="positive" emphasis="subtle" size="large" />
      </div>
      
      <!-- Info Count -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 14px;">New Updates:</span>
        <Counter value={2} color="information" emphasis="subtle" size="small" />
      </div>
    </div>
  `}
/>

<Story name="Responsive Max Width Test" 
  render={(args) => `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p style="font-size: 14px;">Resize browser to test responsive max-width (100px mobile, 120px desktop @ 768px+)</p>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <Counter value={12345} size="small" color="primary" emphasis="subtle" />
        <Counter value={12345} size="medium" color="primary" emphasis="subtle" />
        <Counter value={12345} size="large" color="primary" emphasis="subtle" />
      </div>
    </div>
  `}
/>
