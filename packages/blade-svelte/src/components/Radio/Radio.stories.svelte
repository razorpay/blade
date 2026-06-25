<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RadioGroup from './RadioGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/Radio & RadioGroup',
    component: RadioGroup,
    tags: ['autodocs'],
    args: {
      label: 'Radio example',
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
      size: 'medium',
    },
    argTypes: {
      label: {
        description: 'Renders the label of the radio group.',
        control: { type: 'text' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
      helpText: {
        description: 'Help text of the radio group.',
        control: { type: 'text' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
      errorText: {
        description: 'Error text of the radio group. Renders when validationState is "error".',
        control: { type: 'text' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
      validationState: {
        description: 'Sets the validation state of the radio group.',
        options: ['error', 'none'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: '"error" | "none"' } },
      },
      necessityIndicator: {
        description: 'Renders a necessity indicator after the radio group label.',
        options: ['required', 'optional', 'none'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: '"required" | "optional" | "none"' } },
      },
      isDisabled: {
        description: 'Sets the disabled state of the radio group.',
        control: { type: 'boolean' },
        table: { category: 'RadioGroup Props', type: { summary: 'boolean' } },
      },
      isRequired: {
        description: 'Sets the required state of the radio group.',
        control: { type: 'boolean' },
        table: { category: 'RadioGroup Props', type: { summary: 'boolean' } },
      },
      labelPosition: {
        description: 'Sets the position of the label.',
        options: ['top', 'left'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: '"top" | "left"' } },
      },
      name: {
        description: 'Name attribute for the radio inputs (form submission).',
        control: { type: 'text' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
      onChange: {
        description: 'The callback invoked when any of the radio\'s state changes.',
        table: { category: 'RadioGroup Props', type: { summary: '({ name, value, event }) => void' } },
      },
      size: {
        description: 'Size of the radios.',
        options: ['small', 'medium', 'large'],
        control: { type: 'radio' },
        table: { category: 'RadioGroup Props', type: { summary: '"small" | "medium" | "large"' } },
      },
      orientation: {
        description: 'Orientation of the radio group.',
        options: ['vertical', 'horizontal'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: '"vertical" | "horizontal"' } },
      },
      value: {
        description: 'Value of the radio group (controlled).',
        options: ['apple', 'mango', 'orange'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
      defaultValue: {
        description: 'Initial value of the radio group (uncontrolled).',
        options: ['apple', 'mango', 'orange'],
        control: { type: 'select' },
        table: { category: 'RadioGroup Props', type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  import Radio from './Radio.svelte';
  import Button from '../Button/Button.svelte';
  import type { RadioInstance, RadioSize, RadioGroupProps } from './types';

  let kitchenSinkSelected = $state('orange');
  let radioInstance: RadioInstance | undefined = $state();

  function focusRadio(): void {
    radioInstance?.focus();
  }

  const showcaseSizes: Array<{ id: string; label: string; size: RadioSize }> = [
    { id: 'small', label: 'Size Small', size: 'small' },
    { id: 'medium', label: 'Size Medium', size: 'medium' },
    { id: 'large', label: 'Size Large', size: 'large' },
  ];

  const showcaseRows: Array<{ id: string; label: string; rowProps: Partial<RadioGroupProps> }> = [
    { id: 'default', label: 'Default', rowProps: {} },
    { id: 'disabled', label: 'Disabled', rowProps: { isDisabled: true } },
    { id: 'error', label: 'Error', rowProps: { validationState: 'error' } },
  ];

  const showcaseColumns: Array<{ id: string; label: string; groupProps: Partial<RadioGroupProps> }> = [
    { id: 'unchecked', label: 'Unchecked', groupProps: {} },
    { id: 'checked', label: 'Checked', groupProps: { defaultValue: 'option' } },
  ];
</script>

{#snippet fruits()}
  <Radio value="apple">Apple</Radio>
  <Radio value="mango">Mango</Radio>
  <Radio value="orange">Orange</Radio>
{/snippet}

<!-- 1. Default -->
<Story name="Default">
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 2. RadioGroup Orientation -->
<Story name="RadioGroup Orientation" args={{ orientation: 'vertical' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 3. RadioGroup Orientation Horizontal -->
<Story name="RadioGroup Orientation Horizontal" args={{ orientation: 'horizontal' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 4. HelpText -->
<Story name="HelpText" args={{ helpText: 'RadioGroup help text' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 5. HorizontalRadioGroupWithHelpText -->
<Story
  name="HorizontalRadioGroupWithHelpText"
  args={{ orientation: 'horizontal', helpText: 'RadioGroup help text' }}
>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 6. ErrorText -->
<Story name="ErrorText" args={{ validationState: 'error', errorText: 'RadioGroup help text' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 7. RadioGroup Orientation Horizontal With ErrorText -->
<Story
  name="RadioGroup Orientation Horizontal With ErrorText"
  args={{ orientation: 'horizontal', validationState: 'error', errorText: 'RadioGroup error text' }}
>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 8. Disabled -->
<Story name="Disabled" args={{ isDisabled: true }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 9. Optional -->
<Story name="Optional" args={{ necessityIndicator: 'optional' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 10. Required -->
<Story name="Required" args={{ necessityIndicator: 'required' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 11. Small -->
<Story name="Small" args={{ size: 'small' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 12. Large -->
<Story name="Large" args={{ size: 'large' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 13. LabelPositionLeft -->
<Story name="LabelPositionLeft" args={{ labelPosition: 'left' }}>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 14. KitchenSink -->
<Story name="KitchenSink" asChild>
  <div style="display:flex;flex-direction:column;gap:var(--spacing-7)">
    <RadioGroup helpText="Select atleast one" label="Medium" defaultValue="orange" size="medium">
      <Radio value="apple">Apple</Radio>
      <Radio value="mango">Mango</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>

    <RadioGroup size="small" helpText="Select atleast one" label="Small" defaultValue="orange">
      <Radio helpText="Apples are good" value="apple">Apple</Radio>
      <Radio value="mango">Mango</Radio>
      <Radio value="orange">Orange</Radio>
    </RadioGroup>

    <RadioGroup
      errorText="Selected atleast one item"
      helpText={`You selected ${kitchenSinkSelected}`}
      label="Controlled"
      value={kitchenSinkSelected}
      onChange={({ value }) => {
        kitchenSinkSelected = value;
      }}
    >
      <Radio helpText="Apples Are 25% Air" value="apple">Apple</Radio>
      <Radio helpText="The name “mango” originated in India" value="mango">Mango</Radio>
      <Radio helpText="There are over 600 varieties of oranges." value="orange">Orange</Radio>
    </RadioGroup>

    <RadioGroup
      necessityIndicator="required"
      errorText="Atleast one has to be selected"
      helpText="Select atleast one"
      label="Select your fruit"
    >
      {@render fruits()}
    </RadioGroup>

    <RadioGroup
      validationState="error"
      necessityIndicator="optional"
      errorText="Atleast one has to be selected"
      helpText="Select atleast one"
      label="Select your fruit"
    >
      {@render fruits()}
    </RadioGroup>

    <RadioGroup
      labelPosition="left"
      necessityIndicator="optional"
      validationState="error"
      errorText="This is invalid"
      helpText="Select atleast one"
      label="Select your fruit"
    >
      {@render fruits()}
    </RadioGroup>

    <div style="height:50px;overflow:scroll;margin-top:var(--spacing-4)">
      <RadioGroup
        labelPosition="left"
        necessityIndicator="optional"
        validationState="error"
        errorText="This is invalid"
        helpText="Select atleast one"
        label="Overflow Scroll"
      >
        {@render fruits()}
      </RadioGroup>
    </div>
  </div>
</Story>

<!-- 15. RadioGroup with Label Suffix & Trailing -->
<!--
  React parity: the React story passes `labelSuffix` / `labelTrailing` args, but
  `RadioGroup` does not declare them (only `FormLabel` does) so they are dropped and
  never rendered. Neither component supports these props, so this renders a plain
  RadioGroup with its label + radios — matching the React output exactly.
-->
<Story
  name="RadioGroup with Label Suffix & Trailing"
  args={{ label: 'Select your fruit', labelPosition: 'top' }}
>
  {#snippet template({ children, ...args })}
    <RadioGroup {...args}>
      {@render fruits()}
    </RadioGroup>
  {/snippet}
</Story>

<!-- 16. Radio Ref -->
<Story name="Radio Ref" asChild>
  <div style="display:flex;align-items:center;gap:var(--spacing-3)">
    <RadioGroup label="Radio ref example">
      <Radio bind:this={radioInstance} value="1">Radio</Radio>
    </RadioGroup>
    <Button onClick={focusRadio}>Click to focus the Radio</Button>
  </div>
</Story>

<!-- 17. Showcase -->
<Story name="Showcase" asChild>
  <div style="display:flex;flex-direction:column;gap:var(--spacing-7)">
    {#each showcaseSizes as { id: sizeId, label, size } (sizeId)}
      <div style="display:flex;flex-direction:column;gap:var(--spacing-4)">
        <strong style="font-family:var(--font-family-text);font-weight:var(--font-weight-semibold)">
          {label}
        </strong>
        <div
          style="display:grid;grid-template-columns:140px repeat(2, minmax(160px, 1fr));row-gap:var(--spacing-4);column-gap:var(--spacing-4);align-items:center;justify-items:center"
        >
          <div></div>
          {#each showcaseColumns as column (column.id)}
            <span
              style="font-family:var(--font-family-text);font-size:var(--font-size-75);font-weight:var(--font-weight-medium);text-align:center"
            >
              {column.label}
            </span>
          {/each}
          {#each showcaseRows as row (row.id)}
            <div style="display:flex;justify-content:flex-end;width:100%">
              <span
                style="font-family:var(--font-family-text);font-size:var(--font-size-75);font-weight:var(--font-weight-medium)"
              >
                {row.label}
              </span>
            </div>
            {#each showcaseColumns as column (column.id)}
              <div
                style="padding:var(--spacing-3);display:flex;align-items:center;justify-content:center"
              >
                <RadioGroup
                  label=""
                  name={`showcase-${sizeId}-${row.id}-${column.id}`}
                  {size}
                  {...column.groupProps}
                  {...row.rowProps}
                >
                  <Radio value="option">Option</Radio>
                </RadioGroup>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Story>
