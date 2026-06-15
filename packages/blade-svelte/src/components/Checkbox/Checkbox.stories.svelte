<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from './Checkbox.svelte';

  const { Story } = defineMeta({
    title: 'Components/Checkbox/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    args: {
      defaultChecked: undefined,
      validationState: undefined,
      isChecked: undefined,
      isDisabled: undefined,
      isIndeterminate: undefined,
      isRequired: undefined,
      name: undefined,
      onChange: undefined,
      value: undefined,
      helpText: undefined,
      errorText: undefined,
      children: 'Toggle checkbox',
      size: 'medium',
    },
    argTypes: {
      isChecked: {
        control: { type: 'boolean' },
        description: 'Controls the checked state of the checkbox (controlled).',
        table: { type: { summary: 'boolean' } },
      },
      defaultChecked: {
        control: { type: 'boolean' },
        description: 'The initial checked state of the checkbox (uncontrolled).',
        table: { type: { summary: 'boolean' } },
      },
      isIndeterminate: {
        control: { type: 'boolean' },
        description: 'Renders the checkbox in an indeterminate (mixed) state.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables the checkbox.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      isRequired: {
        control: { type: 'boolean' },
        description: 'Marks the checkbox as required.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      validationState: {
        control: { type: 'select' },
        options: ['error', 'none'],
        description: 'Sets the validation state of the checkbox.',
        table: { type: { summary: '"error" | "none"' } },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Sets the size of the checkbox.',
        table: { type: { summary: '"small" | "medium" | "large"' }, defaultValue: { summary: 'medium' } },
      },
      helpText: {
        control: { type: 'text' },
        description: 'Help text rendered below the checkbox.',
        table: { type: { summary: 'string' } },
      },
      errorText: {
        control: { type: 'text' },
        description: 'Error text rendered when validationState is "error".',
        table: { type: { summary: 'string' } },
      },
      name: {
        control: { type: 'text' },
        description: 'Name attribute for the underlying input.',
        table: { type: { summary: 'string' } },
      },
      value: {
        control: { type: 'text' },
        description: 'Value attribute for the underlying input.',
        table: { type: { summary: 'string' } },
      },
      testID: {
        control: { type: 'text' },
        description: 'Test ID for the outer wrapper.',
        table: { type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  import Button from '../Button/Button.svelte';
  import type { CheckboxInstance } from './types';

  let controlledChecked = $state(false);
  let checkboxInstance: CheckboxInstance | undefined = $state();

  function focusCheckbox(): void {
    checkboxInstance?.focus();
  }

  const showcaseSizes = [
    { id: 'small', label: 'Size Small', size: 'small' },
    { id: 'medium', label: 'Size Medium', size: 'medium' },
    { id: 'large', label: 'Size Large', size: 'large' },
  ] as const;

  const showcaseColumns = [
    { id: 'unchecked', label: 'Unchecked', props: {} },
    { id: 'checked', label: 'Checked', props: { isChecked: true } },
    { id: 'indeterminate', label: 'Indeterminate', props: { isIndeterminate: true } },
  ] as const;

  const showcaseRows = [
    { id: 'default', label: 'Default', props: {} },
    { id: 'helptext', label: 'Help Text', props: { helpText: 'Help text' } },
    { id: 'disabled', label: 'Disabled', props: { isDisabled: true } },
    { id: 'error', label: 'Error', props: { validationState: 'error', errorText: 'Error text' } },
  ] as const;
</script>

<!-- 1. Default -->
<Story name="Default">
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 2. Checked -->
<Story name="Checked" args={{ isChecked: true }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 3. DefaultChecked -->
<Story name="DefaultChecked" args={{ defaultChecked: true }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 4. HelpText -->
<Story name="HelpText" args={{ helpText: 'Checkbox help text' }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 5. ErrorText -->
<Story name="ErrorText" args={{ validationState: 'error', errorText: 'Checkbox error text' }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 6. Small -->
<Story name="Small" args={{ size: 'small' }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 7. Large -->
<Story name="Large" args={{ size: 'large', helpText: 'Checkbox help text' }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 8. Indeterminate -->
<Story name="Indeterminate" args={{ isIndeterminate: true }}>
  {#snippet template(args)}
    <Checkbox {...args} />
  {/snippet}
</Story>

<!-- 9. ControlledAndUncontrolled -->
<Story name="ControlledAndUncontrolled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <Checkbox defaultChecked onChange={(e) => console.log(e)}>Uncontrolled</Checkbox>
    <Checkbox isChecked={controlledChecked} onChange={(e) => (controlledChecked = e.isChecked)}>
      Controlled
    </Checkbox>
    <span style="font-family: var(--font-family-text);">
      Checked: {controlledChecked ? 'True' : 'False'}
    </span>
  </div>
</Story>

<!-- 10. Checkbox Ref -->
<Story name="Checkbox Ref" asChild>
  <div style="display: flex; gap: var(--spacing-3); align-items: center;">
    <Checkbox bind:this={checkboxInstance}>Checkbox</Checkbox>
    <Button onClick={focusCheckbox}>Click to focus the checkbox</Button>
  </div>
</Story>

<!-- 11. Showcase -->
<Story name="Showcase" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-7);">
    {#each showcaseSizes as sizeRow}
      <div style="display: flex; flex-direction: column; gap: var(--spacing-4);">
        <strong style="font-family: var(--font-family-text); font-weight: var(--font-weight-semibold);">
          {sizeRow.label}
        </strong>
        <div
          style="display: grid; grid-template-columns: 140px repeat(3, minmax(160px, 1fr)); row-gap: var(--spacing-4); column-gap: var(--spacing-4); align-items: center; justify-items: center;"
        >
          <div></div>
          {#each showcaseColumns as column}
            <span
              style="font-family: var(--font-family-text); font-size: var(--font-size-75); font-weight: var(--font-weight-medium); text-align: center;"
            >
              {column.label}
            </span>
          {/each}
          {#each showcaseRows as row}
            <div style="display: flex; justify-content: flex-end; width: 100%;">
              <span
                style="font-family: var(--font-family-text); font-size: var(--font-size-75); font-weight: var(--font-weight-medium);"
              >
                {row.label}
              </span>
            </div>
            {#each showcaseColumns as column}
              <div
                style="padding: var(--spacing-3); display: flex; align-items: center; justify-content: center;"
              >
                <Checkbox size={sizeRow.size} {...row.props} {...column.props}>Option</Checkbox>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Story>
