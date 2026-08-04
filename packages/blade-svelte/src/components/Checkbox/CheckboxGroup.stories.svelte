<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckboxGroup from './CheckboxGroup.svelte';

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
      labelPosition: undefined,
      validationState: undefined,
      errorText: undefined,
      name: undefined,
      defaultValue: undefined,
      onChange: undefined,
      value: undefined,
    },
    argTypes: {
      label: {
        control: { type: 'text' },
        description: 'Renders the label of the checkbox group.',
        table: { type: { summary: 'string' } },
      },
      helpText: {
        control: { type: 'text' },
        description: 'Help text of the checkbox group.',
        table: { type: { summary: 'string' } },
      },
      errorText: {
        control: { type: 'text' },
        description: 'Error text rendered when validationState is "error".',
        table: { type: { summary: 'string' } },
      },
      validationState: {
        control: { type: 'select' },
        options: ['error', 'none'],
        description: 'Sets the validation state of the group.',
        table: { type: { summary: '"error" | "none"' } },
      },
      necessityIndicator: {
        control: { type: 'select' },
        options: ['required', 'optional', 'none'],
        description: 'Renders a necessity indicator after the group label.',
        table: { type: { summary: '"required" | "optional" | "none"' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables all checkboxes in the group.',
        table: { type: { summary: 'boolean' } },
      },
      isRequired: {
        control: { type: 'boolean' },
        description: 'Sets the required state of the group.',
        table: { type: { summary: 'boolean' } },
      },
      labelPosition: {
        control: { type: 'select' },
        options: ['top', 'left'],
        description: 'Sets the position of the label.',
        table: { type: { summary: '"top" | "left"' } },
      },
      orientation: {
        control: { type: 'select' },
        options: ['vertical', 'horizontal'],
        description: 'Orientation of the checkbox group.',
        table: { type: { summary: '"vertical" | "horizontal"' } },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Size of the checkboxes within the group.',
        table: { type: { summary: '"small" | "medium" | "large"' } },
      },
      value: {
        options: ['apple', 'mango', 'orange'],
        control: { type: 'multi-select' },
        description: 'Controlled value of the group.',
      },
      defaultValue: {
        options: ['apple', 'mango', 'orange'],
        control: { type: 'multi-select' },
        description: 'Initial uncontrolled value of the group.',
      },
    },
  });
</script>

<script lang="ts">
  import Checkbox from './Checkbox.svelte';
  import Tooltip from '../Tooltip/Tooltip.svelte';
  import TooltipInteractiveWrapper from '../Tooltip/TooltipInteractiveWrapper.svelte';
  import Link from '../Link/Link.svelte';
  import { InfoIcon } from '../Icons';

  const fields = ['apple', 'mango', 'orange'];

  // Story 13 — "Select all" controlling a controlled group.
  let indeterminateSelected = $state(['apple', 'mango']);
  const allChecked = $derived(indeterminateSelected.length === 3);
  const isIndeterminate = $derived(indeterminateSelected.length > 0 && !allChecked);
  const noneSelected = $derived(indeterminateSelected.length < 1);

  // Story 15 — KitchenSink controlled group.
  let kitchenSelected = $state(['mango', 'apple']);
</script>

{#snippet fruits()}
  <Checkbox value="apple">Apple</Checkbox>
  <Checkbox value="mango">Mango</Checkbox>
  <Checkbox value="orange">Orange</Checkbox>
{/snippet}

<!-- 1. Default -->
<Story name="Default">
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 2. CheckboxGroup Orientation Horizontal -->
<Story name="CheckboxGroup Orientation Horizontal" args={{ orientation: 'horizontal' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 3. HelpText -->
<Story name="HelpText" args={{ helpText: 'CheckboxGroup help text' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 4. CheckboxGroup Orientation Horizontal With HelpText -->
<Story
  name="CheckboxGroup Orientation Horizontal With HelpText"
  args={{ orientation: 'horizontal', helpText: 'CheckboxGroup help text' }}
>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 5. ErrorText -->
<Story name="ErrorText" args={{ validationState: 'error', errorText: 'CheckboxGroup help text' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 6. CheckboxGroup Orientation Horizontal With ErrorText -->
<Story
  name="CheckboxGroup Orientation Horizontal With ErrorText"
  args={{ orientation: 'horizontal', validationState: 'error', errorText: 'CheckboxGroup error text' }}
>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 7. Disabled -->
<Story name="Disabled" args={{ isDisabled: true }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 8. Optional -->
<Story name="Optional" args={{ necessityIndicator: 'optional' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 9. Required -->
<Story name="Required" args={{ necessityIndicator: 'required' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 10. Small -->
<Story name="Small" args={{ size: 'small' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 11. Large -->
<Story name="Large" args={{ size: 'large' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 12. LabelPositionLeft -->
<Story name="LabelPositionLeft" args={{ labelPosition: 'left' }}>
  {#snippet template({ children: _children, ...args })}
    <CheckboxGroup {...args}>
      {@render fruits()}
    </CheckboxGroup>
  {/snippet}
</Story>

<!-- 13. Indeterminate — "Select all" controls a controlled group -->
<Story name="Indeterminate" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <Checkbox
      isChecked={allChecked}
      isIndeterminate={isIndeterminate}
      validationState={noneSelected ? 'error' : 'none'}
      onChange={({ isChecked }) => {
        indeterminateSelected = isChecked ? [...fields] : [];
      }}
    >
      Select all
    </Checkbox>
    <CheckboxGroup
      label="Select fruits"
      helpText="Select your favourite fruits"
      errorText="Select atleast one"
      value={indeterminateSelected}
      validationState={noneSelected ? 'error' : 'none'}
      onChange={({ values }) => (indeterminateSelected = values)}
    >
      {#each fields as field}
        <Checkbox value={field}>{field}</Checkbox>
      {/each}
    </CheckboxGroup>
  </div>
</Story>

<!-- 14. CheckboxGroup with Label Suffix & Trailing -->
<Story name="CheckboxGroup with Label Suffix & Trailing" asChild>
  <CheckboxGroup label="Select your fruit" labelPosition="top">
    {#snippet labelSuffix()}
      <Tooltip content="Select your fruit" placement="right">
        {#snippet children()}
          <TooltipInteractiveWrapper display="flex">
            {#snippet children()}
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            {/snippet}
          </TooltipInteractiveWrapper>
        {/snippet}
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small">Learn more</Link>
    {/snippet}
    {@render fruits()}
  </CheckboxGroup>
</Story>

<!-- 15. KitchenSink -->
<Story name="KitchenSink" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <CheckboxGroup
      label="Uncontrolled"
      helpText="Select atleast one"
      defaultValue={['apple', 'orange']}
      onChange={(e) => console.log(e)}
    >
      {@render fruits()}
    </CheckboxGroup>

    <CheckboxGroup
      label="Small checkboxes"
      helpText="Small sized checkboxes"
      size="small"
      defaultValue={['orange']}
      onChange={(e) => console.log(e)}
    >
      {@render fruits()}
    </CheckboxGroup>

    <CheckboxGroup
      label="Controlled"
      errorText="Selected atleast one item"
      helpText={`You selected ${kitchenSelected.join(', ')}`}
      value={kitchenSelected}
      onChange={({ values }) => (kitchenSelected = values)}
    >
      <Checkbox helpText="Apples Are 25% Air" value="apple">Apple</Checkbox>
      <Checkbox helpText={'The name "mango" originated in India'} value="mango">Mango</Checkbox>
      <Checkbox helpText="There are over 600 varieties of oranges." value="orange">Orange</Checkbox>
    </CheckboxGroup>

    <CheckboxGroup
      label="Select your fruit"
      necessityIndicator="required"
      errorText="Atleast one has to be selected"
      helpText="Select atleast one"
    >
      {@render fruits()}
    </CheckboxGroup>

    <CheckboxGroup
      label="Select your fruit"
      validationState="error"
      necessityIndicator="optional"
      errorText="Atleast one has to be selected"
      helpText="Select atleast one"
    >
      {@render fruits()}
    </CheckboxGroup>

    <CheckboxGroup
      label="Select your fruit"
      labelPosition="left"
      necessityIndicator="optional"
      validationState="error"
      errorText="This is invalid"
      helpText="Select atleast one"
    >
      {@render fruits()}
    </CheckboxGroup>

    <div style="height: 50px; overflow: scroll; margin-top: var(--spacing-4);">
      <CheckboxGroup
        label="Overflow Scroll"
        labelPosition="left"
        necessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
      >
        {@render fruits()}
      </CheckboxGroup>
    </div>
  </div>
</Story>
