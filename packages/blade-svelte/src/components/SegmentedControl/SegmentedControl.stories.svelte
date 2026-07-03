<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SegmentedControl from './SegmentedControl.svelte';

  const { Story } = defineMeta({
    title: 'Components/SegmentedControl',
    component: SegmentedControl,
    tags: ['autodocs'],
    args: {
      label: 'Time Period',
      helpText: undefined,
      errorText: undefined,
      validationState: 'none',
      size: 'medium',
      isDisabled: false,
      isRequired: false,
      necessityIndicator: 'none',
      labelPosition: 'top',
      defaultValue: 'daily',
      name: undefined,
    },
    argTypes: {
      label: {
        description: 'Label rendered above (or beside) the segmented control.',
        control: { type: 'text' },
      },
      size: {
        description: 'Size of the segmented control.',
        options: ['small', 'medium', 'large'],
        control: { type: 'select' },
      },
      isDisabled: {
        description: 'Disables the entire segmented control.',
        control: { type: 'boolean' },
      },
      labelPosition: {
        description: 'Position of the label.',
        options: ['top', 'left'],
        control: { type: 'select' },
      },
      validationState: {
        description: 'Validation state.',
        options: ['none', 'error'],
        control: { type: 'select' },
      },
      necessityIndicator: {
        description: 'Renders a necessity indicator after the label.',
        options: ['none', 'required', 'optional'],
        control: { type: 'select' },
      },
      helpText: {
        description: 'Help text below the segmented control.',
        control: { type: 'text' },
      },
      errorText: {
        description: 'Error text when validationState is "error".',
        control: { type: 'text' },
      },
      defaultValue: {
        description: 'Default selected value (uncontrolled).',
        control: { type: 'text' },
      },
      value: { table: { disable: true } },
      onChange: { table: { disable: true } },
      children: { table: { disable: true } },
    },
  });
</script>

<script lang="ts">
  import SegmentedControlItem from './SegmentedControlItem.svelte';

  let controlledValue = $state('weekly');
</script>

{#snippet timePeriodItems()}
  <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
  <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
  <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
{/snippet}

{#snippet timePeriodItemsWithDisabled()}
  <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
  <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
  <SegmentedControlItem value="monthly" isDisabled>Monthly</SegmentedControlItem>
{/snippet}

<!-- 1. Default -->
<Story name="Default">
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 2. Small -->
<Story name="Small" args={{ size: 'small' }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 3. Large -->
<Story name="Large" args={{ size: 'large' }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 4. Disabled (group-level) -->
<Story name="Disabled" args={{ isDisabled: true }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 5. Item Disabled -->
<Story name="Item Disabled">
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItemsWithDisabled()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 6. With Help Text -->
<Story name="With Help Text" args={{ helpText: 'Select how often to refresh data' }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 7. With Error -->
<Story
  name="With Error"
  args={{ validationState: 'error', errorText: 'Please select a valid option' }}
>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 8. Label Left -->
<Story name="Label Left" args={{ labelPosition: 'left', label: 'View' }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {#snippet children()}
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
        <SegmentedControlItem value="table">Table</SegmentedControlItem>
      {/snippet}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 9. Necessity Required -->
<Story name="Necessity Required" args={{ necessityIndicator: 'required' }}>
  {#snippet template({ children, ...args })}
    <SegmentedControl {...args}>
      {@render timePeriodItems()}
    </SegmentedControl>
  {/snippet}
</Story>

<!-- 10. Controlled -->
<Story name="Controlled" asChild>
  <div style="display:flex;flex-direction:column;gap:var(--spacing-4)">
    <p style="font-family:var(--typography-fonts-family-text);font-size:var(--typography-fonts-size-100)">
      Selected: {controlledValue}
    </p>
    <SegmentedControl
      label="Time Period"
      value={controlledValue}
      onChange={({ value }) => { controlledValue = value; }}
    >
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>
  </div>
</Story>

<!-- 11. KitchenSink -->
<Story name="KitchenSink" asChild>
  <div style="display:flex;flex-direction:column;gap:var(--spacing-7);max-width:400px">
    <SegmentedControl label="Medium (default)" defaultValue="daily" size="medium">
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl label="Small" defaultValue="weekly" size="small">
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl label="Large" defaultValue="monthly" size="large">
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl label="Disabled" defaultValue="daily" isDisabled>
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl label="Item Disabled" defaultValue="daily">
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly" isDisabled>Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl
      label="With Error"
      defaultValue="daily"
      validationState="error"
      errorText="Please select a valid period"
    >
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl
      label="With Help Text"
      defaultValue="daily"
      helpText="Controls data refresh frequency"
    >
      <SegmentedControlItem value="daily">Daily</SegmentedControlItem>
      <SegmentedControlItem value="weekly">Weekly</SegmentedControlItem>
      <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
    </SegmentedControl>

    <SegmentedControl label="Label Left" defaultValue="list" labelPosition="left">
      <SegmentedControlItem value="list">List</SegmentedControlItem>
      <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
      <SegmentedControlItem value="table">Table</SegmentedControlItem>
    </SegmentedControl>
  </div>
</Story>
