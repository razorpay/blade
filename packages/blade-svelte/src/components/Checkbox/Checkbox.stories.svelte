<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from './Checkbox.svelte';

  const { Story } = defineMeta({
    title: 'Components/Checkbox/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    args: {
      isChecked: undefined,
      defaultChecked: undefined,
      isDisabled: false,
      isIndeterminate: false,
      isRequired: false,
      validationState: 'none',
      size: 'medium',
      name: undefined,
      value: undefined,
      helpText: undefined,
      errorText: undefined,
      tabIndex: undefined,
    },
    argTypes: {
      isChecked: {
        control: { type: 'boolean' },
        description: 'Controlled checked state.',
        table: { type: { summary: 'boolean' } },
      },
      defaultChecked: {
        control: { type: 'boolean' },
        description: 'Initial checked state (uncontrolled).',
        table: { type: { summary: 'boolean' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables the checkbox.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      isIndeterminate: {
        control: { type: 'boolean' },
        description: 'Shows the indeterminate state.',
        table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      },
      validationState: {
        control: { type: 'select' },
        options: ['none', 'error'],
        description: "Sets the validation state. Use 'error' to show errorText.",
        table: { type: { summary: '"none" | "error"' }, defaultValue: { summary: 'none' } },
      },
      size: {
        control: { type: 'select' },
        options: ['small', 'medium', 'large'],
        description: 'Size of the checkbox.',
        table: {
          type: { summary: '"small" | "medium" | "large"' },
          defaultValue: { summary: 'medium' },
        },
      },
      helpText: {
        control: { type: 'text' },
        description: 'Help text displayed below the label.',
        table: { type: { summary: 'string' } },
      },
      errorText: {
        control: { type: 'text' },
        description: "Error text shown when validationState is 'error'.",
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
        description: 'Test ID for the outer wrapper element.',
        table: { type: { summary: 'string' } },
      },
    },
  });
</script>

<script lang="ts">
  let controlledChecked = $state(false);

  const showcaseSizes = ['small', 'medium', 'large'] as const;
  const showcaseColumns = [
    { label: 'Unchecked', isChecked: false, isIndeterminate: false },
    { label: 'Checked', isChecked: true, isIndeterminate: false },
    { label: 'Indeterminate', isChecked: false, isIndeterminate: true },
  ] as const;
  const showcaseRows = [
    { label: 'Default', props: {} },
    { label: 'Help Text', props: { helpText: 'Help text' } },
    { label: 'Disabled', props: { isDisabled: true } },
    { label: 'Error', props: { validationState: 'error' as const, errorText: 'Error text' } },
  ];
</script>

<!-- 1. Default — args playground (controls wire directly) -->
<Story name="Default" />

<!-- 2. Checked — controlled -->
<Story name="Checked" args={{ isChecked: true }} />

<!-- 3. DefaultChecked — uncontrolled starting checked -->
<Story name="DefaultChecked" args={{ defaultChecked: true }} />

<!-- 4. HelpText -->
<Story name="HelpText" args={{ helpText: 'This is a help text' }} />

<!-- 5. ErrorText -->
<Story name="ErrorText" args={{ validationState: 'error', errorText: 'This is an error text' }} />

<!-- 6. Small -->
<Story name="Small" args={{ size: 'small' }} />

<!-- 7. Large -->
<Story name="Large" args={{ size: 'large' }} />

<!-- 8. Indeterminate -->
<Story name="Indeterminate" args={{ isIndeterminate: true }} />

<!-- 9. ControlledAndUncontrolled — stateful; keep as asChild -->
<Story name="ControlledAndUncontrolled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-4);">
    <Checkbox defaultChecked onChange={(e) => console.log('uncontrolled', e)}>
      Uncontrolled (starts checked)
    </Checkbox>
    <Checkbox
      isChecked={controlledChecked}
      onChange={(e) => (controlledChecked = e.isChecked)}
    >
      Controlled — {controlledChecked ? 'Checked' : 'Unchecked'}
    </Checkbox>
  </div>
</Story>

<!-- 10. Showcase — full size × state × row matrix -->
<Story name="Showcase" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-11);">
    {#each showcaseSizes as size}
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <strong
          style="
            font-family: var(--font-family-text);
            font-size: var(--font-size-200);
            font-weight: var(--font-weight-semibold);
          "
        >
          Size {size}
        </strong>

        <div
          style="
            display: grid;
            grid-template-columns: 140px repeat(3, minmax(160px, 1fr));
            row-gap: var(--spacing-4);
            column-gap: var(--spacing-4);
            align-items: center;
          "
        >
          <!-- Header row -->
          <div></div>
          {#each showcaseColumns as col}
            <span
              style="
                font-family: var(--font-family-text);
                font-size: var(--font-size-75);
                font-weight: var(--font-weight-semibold);
                color: var(--surface-text-gray-muted);
                text-align: center;
              "
            >
              {col.label}
            </span>
          {/each}

          <!-- Data rows -->
          {#each showcaseRows as row}
            <span
              style="
                font-family: var(--font-family-text);
                font-size: var(--font-size-75);
                color: var(--surface-text-gray-muted);
              "
            >
              {row.label}
            </span>
            {#each showcaseColumns as col}
              <div style="display: flex; justify-content: center;">
                <Checkbox
                  {size}
                  isChecked={col.isChecked}
                  isIndeterminate={col.isIndeterminate}
                  onChange={() => {}}
                  {...row.props}
                >
                  {col.label}
                </Checkbox>
              </div>
            {/each}
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Story>
