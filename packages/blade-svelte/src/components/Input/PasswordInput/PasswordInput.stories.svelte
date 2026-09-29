<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PasswordInput from './PasswordInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/PasswordInput',
    component: PasswordInput,
    tags: ['autodocs'],
    args: {
      name: 'password',
      label: 'Enter password',
      helpText: 'We recommend having at least 8 characters in your password',
      placeholder: 'Enter a strong password',
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
      necessityIndicator: {
        control: { type: 'select' },
        options: ['none', 'required'],
        description: 'Necessity indicator shown after the label text.',
        table: { defaultValue: { summary: 'none' } },
      },
      autoCompleteSuggestionType: {
        control: { type: 'select' },
        options: ['none', 'password', 'newPassword'],
        description: 'Autocomplete suggestion type for browser autofill / password managers.',
      },
      isDisabled: { control: { type: 'boolean' }, description: 'Disables the input.' },
      isRequired: { control: { type: 'boolean' }, description: 'Marks the input required.' },
      showRevealButton: {
        control: { type: 'boolean' },
        description: 'Shows a reveal button to toggle password visibility.',
        table: { defaultValue: { summary: 'true' } },
      },
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
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import TooltipInteractiveWrapper from '../../Tooltip/TooltipInteractiveWrapper.svelte';
  import Text from '../../Typography/Text/Text.svelte';
  import { InfoIcon } from '../../Icons';
  import type { PasswordInputProps } from './types';

  let controlledValue = $state('');
  let inputInstance: { focus: () => void; getInput: () => HTMLInputElement | null } | undefined =
    $state();

  // React's Showcase passes necessityIndicator="optional" although the public
  // PasswordInput type excludes it (upstream inconsistency). Cast for parity.
  const optionalNecessity = 'optional' as unknown as PasswordInputProps['necessityIndicator'];
</script>

<!-- 1 -->
<Story name="Default">
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="Auto Complete" args={{ autoCompleteSuggestionType: 'newPassword' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story name="Max Characters" args={{ maxCharacters: 16 }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="Error State" args={{ validationState: 'error', errorText: 'Error' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 5 -->
<Story name="Success State" args={{ validationState: 'success', successText: 'Success' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 6 -->
<Story name="Label At Left" args={{ labelPosition: 'left' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 7 -->
<Story name="Password Input Without Label" args={{ label: undefined, accessibilityLabel: 'Password' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 8 -->
<Story name="Disabled" args={{ isDisabled: true, defaultValue: 'My_Strong#Password!' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 9 -->
<Story name="Required" args={{ isRequired: true, necessityIndicator: 'required' }}>
  {#snippet template(args)}
    <PasswordInput {...args} />
  {/snippet}
</Story>

<!-- 10 -->
<Story name="Password Input Sizes" asChild>
  <div style="display: flex; flex-direction: column;">
    <Text size="large" marginBottom="spacing.2">Medium Size:</Text>
    <PasswordInput
      name="password"
      label="Enter password"
      helpText="We recommend having at least 8 characters in your password"
      placeholder="Enter a strong password"
      size="medium"
    />
    <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">Large Size:</Text>
    <PasswordInput
      name="password"
      label="Enter password"
      helpText="We recommend having at least 8 characters in your password"
      placeholder="Enter a strong password"
      size="large"
    />
  </div>
</Story>

<!-- 11 -->
<Story name="Controlled Input" asChild>
  <PasswordInput
    label="Controlled PasswordInput"
    helpText="See the console for output"
    value={controlledValue}
    onChange={({ value }) => {
      console.log('Controlled Input Value:', value);
      controlledValue = value ?? '';
    }}
  />
</Story>

<!-- 12 -->
<Story name="Password Input Ref" asChild>
  <div style="display: flex; gap: var(--spacing-3); align-items: flex-end;">
    <PasswordInput bind:this={inputInstance} label="Message" />
    <Button onClick={() => inputInstance?.focus()}>Click to focus the input</Button>
  </div>
</Story>

<!-- 13 -->
<Story name="PasswordInput with Label Suffix & Trailing" asChild>
  <PasswordInput
    name="password"
    label="Enter password"
    helpText="We recommend having at least 8 characters in your password"
    placeholder="Enter password"
  >
    {#snippet labelSuffix()}
      <Tooltip content="Enter your password" placement="right">
        <TooltipInteractiveWrapper display="flex">
          <InfoIcon size="small" color="surface.icon.gray.muted" />
        </TooltipInteractiveWrapper>
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => {}}>Learn more</Link>
    {/snippet}
  </PasswordInput>
</Story>

<!-- 14 -->
<Story name="Showcase - All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-8);">
    <!-- Basic Variants -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Basic Variants
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput label="Default" placeholder="Enter password" name="default" />
        <PasswordInput label="With Value" defaultValue="My_Strong#Password123" name="withValue" />
        <PasswordInput
          label="With Help Text"
          placeholder="Enter password"
          helpText="We recommend having at least 8 characters in your password"
          name="withHelpText"
        />
        <PasswordInput label="Disabled" placeholder="Enter password" isDisabled name="disabled" />
      </div>
    </div>

    <!-- Validation States -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Validation States
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput
          label="Error State"
          defaultValue="WeakPassword"
          validationState="error"
          errorText="Password must be at least 8 characters long"
          name="error"
        />
        <PasswordInput
          label="Success State"
          defaultValue="StrongPassword123!"
          validationState="success"
          successText="Password meets all requirements"
          name="success"
        />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Sizes
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput label="Medium Size" placeholder="Medium size password input" size="medium" name="sizeMedium" />
        <PasswordInput label="Large Size" placeholder="Large size password input" size="large" name="sizeLarge" />
      </div>
    </div>

    <!-- Label Positions -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Label Positions
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput label="Label Top" placeholder="Label on top" labelPosition="top" name="labelTop" />
        <PasswordInput label="Label Left" placeholder="Label on left" labelPosition="left" name="labelLeft" />
      </div>
    </div>

    <!-- Necessity Indicators -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Necessity Indicators
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput label="Required Field" placeholder="Enter password" necessityIndicator="required" name="required" />
        <PasswordInput label="Optional Field" placeholder="Enter password" necessityIndicator={optionalNecessity} name="optional" />
      </div>
    </div>

    <!-- With Reveal Button -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Reveal Button
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <PasswordInput
          label="With Reveal Button"
          placeholder="Enter password"
          showRevealButton
          defaultValue="MyPassword123"
          name="withRevealButton"
        />
        <PasswordInput
          label="Without Reveal Button"
          placeholder="Enter password"
          showRevealButton={false}
          defaultValue="MyPassword123"
          name="withoutRevealButton"
        />
      </div>
    </div>

    <!-- With Max Characters -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Max Characters
      </Text>
      <PasswordInput label="Max Characters" placeholder="Max 20 characters" maxCharacters={20} name="maxCharacters" />
    </div>

    <!-- With Label Suffix & Trailing -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="surface.text.gray.subtle">
        With Label Suffix & Trailing
      </Text>
      <PasswordInput label="Password" placeholder="Enter password" name="labelSuffixTrailing">
        {#snippet labelSuffix()}
          <Tooltip content="Your password should be strong and secure" placement="right">
            <TooltipInteractiveWrapper display="flex">
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            </TooltipInteractiveWrapper>
          </Tooltip>
        {/snippet}
        {#snippet labelTrailing()}
          <Link size="small" onClick={() => {}}>Learn more</Link>
        {/snippet}
      </PasswordInput>
    </div>
  </div>
</Story>
