<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckboxGroup from './CheckboxGroup/CheckboxGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Checkbox/CheckboxGroup',
    component: CheckboxGroup,
    tags: ['autodocs'],
    args: {
      label: 'Checkbox Group',
      helpText: undefined,
      isDisabled: false,
      isRequired: false,
      necessityIndicator: 'none',
      labelPosition: 'top',
      validationState: 'none',
      errorText: undefined,
      name: undefined,
      defaultValue: undefined,
      value: undefined,
      size: 'medium',
      orientation: 'vertical',
    },
    argTypes: {
      label: {
        control: { type: 'text' },
        description: 'Label for the checkbox group.',
        table: { type: { summary: 'string' } },
      },
      helpText: {
        control: { type: 'text' },
        description: 'Help text shown below the group.',
        table: { type: { summary: 'string' } },
      },
      errorText: {
        control: { type: 'text' },
        description: "Error text shown when validationState is 'error'.",
        table: { type: { summary: 'string' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables all checkboxes in the group.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      isRequired: {
        control: { type: 'boolean' },
        description: 'Marks the group as required.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      necessityIndicator: {
        control: { type: 'select' },
        options: ['none', 'required', 'optional'],
        description: 'Renders a necessity indicator after the label.',
        table: { type: { summary: '"none" | "required" | "optional"' }, defaultValue: { summary: 'none' } },
      },
      labelPosition: {
        control: { type: 'select' },
        options: ['top', 'left'],
        description: 'Position of the group label.',
        table: { type: { summary: '"top" | "left"' }, defaultValue: { summary: 'top' } },
      },
      validationState: {
        control: { type: 'select' },
        options: ['none', 'error'],
        description: "Sets the validation state for the group.",
        table: { type: { summary: '"none" | "error"' }, defaultValue: { summary: 'none' } },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Size propagated to all child checkboxes.',
        table: { type: { summary: '"small" | "medium" | "large"' }, defaultValue: { summary: 'medium' } },
      },
      orientation: {
        control: { type: 'select' },
        options: ['vertical', 'horizontal'],
        description: 'Layout direction of the checkboxes.',
        table: { type: { summary: '"vertical" | "horizontal"' }, defaultValue: { summary: 'vertical' } },
      },
      name: {
        control: { type: 'text' },
        description: 'Name attribute shared across all checkboxes.',
        table: { type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  import Checkbox from './Checkbox.svelte';

  const fruits = ['apple', 'mango', 'orange'] as const;

  // Indeterminate story state
  let selected = $state<string[]>(['apple', 'mango']);
  const allChecked = $derived(selected.length === fruits.length);
  const isIndeterminate = $derived(selected.length > 0 && !allChecked);
  const noneSelected = $derived(selected.length === 0);

  // KitchenSink controlled state
  let kitchenSinkSelected = $state(['mango', 'apple']);
</script>

<!-- 1. Default -->
<Story name="Default" asChild>
  <CheckboxGroup label="Checkbox Group">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 2. CheckboxGroup Orientation Horizontal -->
<Story name="CheckboxGroup Orientation Horizontal" asChild>
  <CheckboxGroup label="Checkbox Group" orientation="horizontal">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 3. HelpText -->
<Story name="HelpText" asChild>
  <CheckboxGroup label="Checkbox Group" helpText="CheckboxGroup help text">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 4. CheckboxGroup Orientation Horizontal With HelpText -->
<Story name="CheckboxGroup Orientation Horizontal With HelpText" asChild>
  <CheckboxGroup
    label="Checkbox Group"
    orientation="horizontal"
    helpText="CheckboxGroup help text"
  >
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 5. ErrorText -->
<Story name="ErrorText" asChild>
  <CheckboxGroup
    label="Checkbox Group"
    validationState="error"
    errorText="CheckboxGroup error text"
  >
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 6. CheckboxGroup Orientation Horizontal With ErrorText -->
<Story name="CheckboxGroup Orientation Horizontal With ErrorText" asChild>
  <CheckboxGroup
    label="Checkbox Group"
    orientation="horizontal"
    validationState="error"
    errorText="CheckboxGroup error text"
  >
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 7. Disabled -->
<Story name="Disabled" asChild>
  <CheckboxGroup label="Checkbox Group" isDisabled>
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 8. Optional -->
<Story name="Optional" asChild>
  <CheckboxGroup label="Checkbox Group" necessityIndicator="optional">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 9. Required -->
<Story name="Required" asChild>
  <CheckboxGroup label="Checkbox Group" necessityIndicator="required">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 10. Small -->
<Story name="Small" asChild>
  <CheckboxGroup label="Checkbox Group" size="small">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 11. Large -->
<Story name="Large" asChild>
  <CheckboxGroup label="Checkbox Group" size="large">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 12. LabelPositionLeft -->
<Story name="LabelPositionLeft" asChild>
  <CheckboxGroup label="Checkbox Group" labelPosition="left">
    {#snippet children()}
      <Checkbox value="apple">Apple</Checkbox>
      <Checkbox value="mango">Mango</Checkbox>
      <Checkbox value="orange">Orange</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 13. Indeterminate — "Select all" pattern -->
<Story name="Indeterminate" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-4);">
    <Checkbox
      isChecked={allChecked}
      isIndeterminate={isIndeterminate}
      validationState={noneSelected ? 'error' : 'none'}
      onChange={(e) => {
        selected = e.isChecked ? [...fruits] : [];
      }}
    >
      Select all
    </Checkbox>

    <CheckboxGroup
      label="Select fruits"
      helpText="Select your favourite fruits"
      errorText="Select at least one"
      value={selected}
      validationState={noneSelected ? 'error' : 'none'}
      onChange={({ values }) => (selected = values)}
    >
      {#snippet children()}
        {#each fruits as fruit}
          <Checkbox value={fruit}>{fruit}</Checkbox>
        {/each}
      {/snippet}
    </CheckboxGroup>
  </div>
</Story>

<!-- 14. KitchenSink -->
<Story name="KitchenSink" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-6);">
    <CheckboxGroup
      helpText="Select at least one"
      label="Uncontrolled"
      defaultValue={['apple', 'orange']}
      onChange={(e) => console.log(e)}
    >
      {#snippet children()}
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>

    <CheckboxGroup
      helpText="Small sized checkboxes"
      label="Small checkboxes"
      size="small"
      defaultValue={['orange']}
      onChange={(e) => console.log(e)}
    >
      {#snippet children()}
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>

    <CheckboxGroup
      errorText="Selected at least one item"
      helpText={`You selected: ${kitchenSinkSelected.join(', ')}`}
      label="Controlled"
      value={kitchenSinkSelected}
      onChange={({ values }) => (kitchenSinkSelected = values)}
    >
      {#snippet children()}
        <Checkbox value="apple" helpText="Apples are 25% air">Apple</Checkbox>
        <Checkbox value="mango" helpText='The name "mango" originated in India'>Mango</Checkbox>
        <Checkbox value="orange" helpText="There are over 600 varieties of oranges.">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>

    <CheckboxGroup
      necessityIndicator="required"
      errorText="At least one has to be selected"
      helpText="Select at least one"
      label="Select your fruit"
    >
      {#snippet children()}
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>

    <CheckboxGroup
      validationState="error"
      necessityIndicator="optional"
      errorText="At least one has to be selected"
      helpText="Select at least one"
      label="Select your fruit"
    >
      {#snippet children()}
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>

    <CheckboxGroup
      labelPosition="left"
      necessityIndicator="optional"
      validationState="error"
      errorText="This is invalid"
      helpText="Select at least one"
      label="Select your fruit"
    >
      {#snippet children()}
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      {/snippet}
    </CheckboxGroup>
  </div>
</Story>
