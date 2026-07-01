<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextInput from './TextInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/TextInput',
    component: TextInput,
    tags: ['autodocs'],
    args: {
      label: 'Enter Name',
      placeholder: 'Enter your first and last name',
      name: 'fullName',
      size: 'medium',
    },
    argTypes: {
      label: { control: { type: 'text' }, description: 'Label for the input.' },
      placeholder: { control: { type: 'text' }, description: 'Placeholder text.' },
      helpText: { control: { type: 'text' }, description: 'Help text rendered below the input.' },
      errorText: { control: { type: 'text' }, description: 'Error text (with validationState="error").' },
      successText: { control: { type: 'text' }, description: 'Success text (with validationState="success").' },
      validationState: {
        control: { type: 'select' },
        options: ['none', 'error', 'success'],
        description: 'Validation state of the input.',
      },
      size: {
        control: { type: 'select' },
        options: ['medium', 'large'],
        description: 'Sets the size of the input.',
        table: { defaultValue: { summary: 'medium' } },
      },
      type: {
        control: { type: 'select' },
        options: ['text', 'telephone', 'email', 'url', 'number', 'search'],
        description: 'Input type.',
      },
      isDisabled: { control: { type: 'boolean' }, description: 'Disables the input.' },
      isRequired: { control: { type: 'boolean' }, description: 'Marks the input required.' },
      showClearButton: { control: { type: 'boolean' }, description: 'Renders a clear button.' },
      isLoading: { control: { type: 'boolean' }, description: 'Shows a loading spinner.' },
      maxCharacters: { control: { type: 'number' }, description: 'Character counter limit.' },
      accessibilityLabel: {
        control: { type: 'text' },
        description: 'Accessibility label (used when label is absent).',
      },
    },
  });
</script>

<script lang="ts">
  import Button from '../../Button/Button.svelte';
  import Link from '../../Link/Link.svelte';
  import Badge from '../../Badge/Badge.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import { InfoIcon, BuildingIcon } from '../../Icons';

  let controlledValue = $state('');
  let inputInstance: { focus: () => void; getInput: () => HTMLInputElement | null } | undefined =
    $state();

  const validationStates = ['none', 'error', 'success'] as const;
  const sizes = ['medium', 'large'] as const;

  const columnStyle = 'display: flex; flex-direction: column; gap: var(--spacing-5);';
  const rowStyle = 'display: flex; gap: var(--spacing-3); align-items: center;';
  const gridStyle =
    'display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-5);';
  const labelStyle = 'font-family: var(--font-family-text);';
</script>

<!-- 1 -->
<Story name="TextInput">
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="TextInput with type number" args={{ type: 'number', label: 'Enter Amount', placeholder: '1000' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story name="TextInput with Help Text" args={{ helpText: 'Enter your full name as per your PAN card' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="TextInput with error" args={{ validationState: 'error', errorText: 'Invalid name' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 5 -->
<Story name="TextInput with success" args={{ validationState: 'success', successText: 'Name is valid' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 6 -->
<Story name="TextInput without label" args={{ label: undefined, accessibilityLabel: 'Enter your name' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 7 -->
<Story name="TextInput with trailing action button" asChild>
  <TextInput label="Enter Coupon" placeholder="ABCD1234">
    {#snippet trailingButton()}
      <Link onClick={() => {}}>Apply</Link>
    {/snippet}
  </TextInput>
</Story>

<!-- 8 -->
<Story name="TextInputMaxCharacters" asChild>
  <TextInput label="Enter Name" placeholder="John Doe" maxCharacters={10} />
</Story>

<!-- 9 -->
<Story name="TextInputSizes" asChild>
  <div style={columnStyle}>
    {#each sizes as size (size)}
      <TextInput {size} label={`Size ${size}`} placeholder="Enter your name" />
    {/each}
  </div>
</Story>

<!-- 10 -->
<Story name="TextInputUncontrolled" asChild>
  <TextInput label="Name" defaultValue="John Doe" onChange={(e) => console.log(e)} />
</Story>

<!-- 11 -->
<Story name="TextInputControlled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <TextInput label="Name" value={controlledValue} onChange={(e) => (controlledValue = e.value ?? '')} />
    <span style={labelStyle}>Value: {controlledValue}</span>
  </div>
</Story>

<!-- 12 -->
<Story name="TextInputKitchenSink" asChild>
  <div style={gridStyle}>
    {#each validationStates as validationState (validationState)}
      {#each sizes as size (size)}
        <TextInput
          {size}
          {validationState}
          label={`${size} / ${validationState}`}
          placeholder="Text"
          helpText={validationState === 'none' ? 'Help text' : undefined}
          errorText={validationState === 'error' ? 'Error text' : undefined}
          successText={validationState === 'success' ? 'Success text' : undefined}
        />
      {/each}
    {/each}
  </div>
</Story>

<!-- 13 -->
<Story name="Text Input Ref" asChild>
  <div style={rowStyle}>
    <TextInput bind:this={inputInstance} label="Name" placeholder="Enter your name" />
    <Button onClick={() => inputInstance?.focus()}>Focus the input</Button>
  </div>
</Story>

<!-- 14 -->
<Story name="TextInputWithLeadingIcon" asChild>
  <TextInput label="Bank Account" placeholder="Enter account number" leadingIcon={BuildingIcon} />
</Story>

<!-- 15 -->
<Story name="TextInputWithTrailingIcon" asChild>
  <TextInput label="Name" placeholder="Enter your name" trailingIcon={InfoIcon} />
</Story>

<!-- 16 -->
<Story name="TextInputWithLeadingElement" asChild>
  <TextInput label="Enter your upi id" placeholder="98000xxxxx">
    {#snippet leading()}
      <Badge color="neutral">+91</Badge>
    {/snippet}
  </TextInput>
</Story>

<!-- 17 -->
<Story name="TextInputWithTrailingElement" asChild>
  <TextInput label="UPI ID" placeholder="username">
    {#snippet trailing()}
      <div style="padding-right: var(--spacing-4); display: flex; align-items: center;">
        <Badge color="neutral">@oksbi</Badge>
      </div>
    {/snippet}
  </TextInput>
</Story>

<!-- 18 -->
<Story name="TextInput with Label Suffix & Trailing" asChild>
  <TextInput label="Name" placeholder="Enter your name">
    {#snippet labelSuffix()}
      <Tooltip content="Enter your name as per your PAN card">
        <div style="display: flex; align-items: center;">
          <InfoIcon size="small" color="surface.icon.gray.muted" />
        </div>
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => {}}>Learn more</Link>
    {/snippet}
  </TextInput>
</Story>

<!-- 19 -->
<Story name="Showcase - All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-6);">
    {#each validationStates as validationState (validationState)}
      <TextInput
        {validationState}
        label={`Validation: ${validationState}`}
        placeholder="Enter text"
        helpText={validationState === 'none' ? 'Help text' : undefined}
        errorText={validationState === 'error' ? 'Error text' : undefined}
        successText={validationState === 'success' ? 'Success text' : undefined}
      />
    {/each}
    <TextInput label="With leading icon" placeholder="Text" leadingIcon={BuildingIcon} />
    <TextInput label="With clear button" placeholder="Text" showClearButton defaultValue="Clear me" />
    <TextInput label="Loading" placeholder="Text" isLoading />
    <TextInput label="Disabled" placeholder="Text" isDisabled />
  </div>
</Story>
