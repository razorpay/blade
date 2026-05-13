<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from './Checkbox.svelte';

  const { Story } = defineMeta({
    title: 'Components/Checkbox',
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
        table: {
          type: { summary: '"none" | "error"' },
          defaultValue: { summary: 'none' },
        },
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
  import CheckboxGroup from './CheckboxGroup/CheckboxGroup.svelte';

  let controlledChecked = $state(false);
  let groupValues = $state<string[]>([]);

  const showcaseSizes = ['small', 'medium', 'large'] as const;
  const showcaseStates = [
    { label: 'Unchecked', isChecked: false },
    { label: 'Checked', isChecked: true },
    { label: 'Indeterminate', isChecked: false, isIndeterminate: true },
  ] as const;
  const showcaseVariants = [
    { label: 'Default', isDisabled: false },
    { label: 'Disabled', isDisabled: true },
  ] as const;

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
</script>

<!-- 1. Default — args-only playground -->
<Story name="Default" asChild>
  <Checkbox>I agree to the terms and conditions</Checkbox>
</Story>

<!-- 2. Checked — controlled -->
<Story name="Checked" asChild>
  <Checkbox isChecked={true} onChange={(e) => console.log('onChange', e)}>
    Controlled checkbox
  </Checkbox>
</Story>

<!-- 3. DefaultChecked — uncontrolled -->
<Story name="DefaultChecked" asChild>
  <Checkbox defaultChecked>
    Uncontrolled checkbox (starts checked)
  </Checkbox>
</Story>

<!-- 4. Indeterminate -->
<Story name="Indeterminate" asChild>
  <Checkbox isIndeterminate>
    Indeterminate state
  </Checkbox>
</Story>

<!-- 5. WithHelpText -->
<Story name="WithHelpText" asChild>
  <Checkbox helpText="You can change this setting later.">
    Receive marketing emails
  </Checkbox>
</Story>

<!-- 6. WithError -->
<Story name="WithError" asChild>
  <Checkbox validationState="error" errorText="You must accept the terms to continue.">
    I agree to the terms and conditions
  </Checkbox>
</Story>

<!-- 7. Disabled -->
<Story name="Disabled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-4);">
    <Checkbox isDisabled>Disabled unchecked</Checkbox>
    <Checkbox isDisabled isChecked={true} onChange={() => {}}>Disabled checked</Checkbox>
    <Checkbox isDisabled isIndeterminate>Disabled indeterminate</Checkbox>
  </div>
</Story>

<!-- 8. Sizes -->
<Story name="Sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <Checkbox size="small">Small checkbox</Checkbox>
    <Checkbox size="medium">Medium checkbox</Checkbox>
    <Checkbox size="large">Large checkbox</Checkbox>
  </div>
</Story>

<!-- 9. ControlledAndUncontrolled -->
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

<!-- 10. WithCheckboxGroup — vertical -->
<Story name="WithCheckboxGroup" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-8);">
    <CheckboxGroup
      label="Select your interests"
      helpText="Choose all that apply."
      name="interests"
      onChange={(e) => (groupValues = e.values)}
    >
      {#snippet children()}
        <Checkbox value="design">Design</Checkbox>
        <Checkbox value="engineering">Engineering</Checkbox>
        <Checkbox value="product">Product</Checkbox>
        <Checkbox value="marketing">Marketing</Checkbox>
      {/snippet}
    </CheckboxGroup>
    <p style="font-family: var(--font-family-text); font-size: var(--font-size-75);">
      Selected: {groupValues.join(', ') || 'none'}
    </p>
  </div>
</Story>

<!-- 11. CheckboxGroup — horizontal -->
<Story name="CheckboxGroupHorizontal" asChild>
  <CheckboxGroup
    label="Preferred contact methods"
    orientation="horizontal"
    name="contact"
  >
    {#snippet children()}
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="whatsapp">WhatsApp</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 12. CheckboxGroup — with error -->
<Story name="CheckboxGroupWithError" asChild>
  <CheckboxGroup
    label="Agree to policies"
    validationState="error"
    errorText="You must select all required policies."
    name="policies"
  >
    {#snippet children()}
      <Checkbox value="privacy">Privacy Policy</Checkbox>
      <Checkbox value="terms">Terms of Service</Checkbox>
      <Checkbox value="cookies">Cookie Policy</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 13. CheckboxGroup — disabled -->
<Story name="CheckboxGroupDisabled" asChild>
  <CheckboxGroup
    label="Payment methods"
    isDisabled
    defaultValue={['upi']}
    name="payment"
  >
    {#snippet children()}
      <Checkbox value="upi">UPI</Checkbox>
      <Checkbox value="card">Card</Checkbox>
      <Checkbox value="netbanking">Net Banking</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 14. CheckboxGroup — label left -->
<Story name="CheckboxGroupLabelLeft" asChild>
  <CheckboxGroup
    label="Notifications"
    labelPosition="left"
    name="notifications"
  >
    {#snippet children()}
      <Checkbox value="push">Push</Checkbox>
      <Checkbox value="email">Email</Checkbox>
    {/snippet}
  </CheckboxGroup>
</Story>

<!-- 15. Showcase — full matrix -->
<Story name="Showcase" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-11);">
    {#each showcaseSizes as size}
      <div style="display: flex; flex-direction: column; gap: var(--spacing-7);">
        <strong
          style="
            font-family: var(--font-family-text);
            font-size: var(--font-size-200);
            font-weight: var(--font-weight-semibold);
          "
        >
          Size: {capitalize(size)}
        </strong>

        <div style="display: flex; flex-direction: row; gap: var(--spacing-11); flex-wrap: wrap;">
          {#each showcaseVariants as variant}
            <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
              <strong
                style="
                  font-family: var(--font-family-text);
                  font-size: var(--font-size-100);
                  color: var(--surface-text-gray-muted);
                "
              >
                {variant.label}
              </strong>

              {#each showcaseStates as state}
                <Checkbox
                  {size}
                  isChecked={state.isChecked}
                  isIndeterminate={'isIndeterminate' in state ? state.isIndeterminate : false}
                  isDisabled={variant.isDisabled}
                  onChange={() => {}}
                >
                  {state.label}
                </Checkbox>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</Story>
