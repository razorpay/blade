<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import OTPInput from './OTPInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/OTPInput',
    component: OTPInput,
    tags: ['autodocs'],
    args: {
      label: 'Enter OTP',
      labelPosition: 'top',
      name: 'otp',
      placeholder: '',
      isDisabled: false,
      autoFocus: false,
      validationState: 'none',
      otpLength: 6,
    },
    argTypes: {
      label: { control: { type: 'text' }, description: 'Label shown above/beside the fields.' },
      otpLength: {
        control: { type: 'inline-radio' },
        options: [4, 6],
        description: 'Number of OTP fields.',
        table: { defaultValue: { summary: '6' } },
      },
      isMasked: { control: { type: 'boolean' }, description: 'Masks the entered characters.' },
      isDisabled: { control: { type: 'boolean' }, description: 'Disables all fields.' },
      autoFocus: { control: { type: 'boolean' }, description: 'Focus the first field on mount.' },
      helpText: { control: { type: 'text' }, description: 'Help text below the fields.' },
      errorText: { control: { type: 'text' }, description: 'Error text (with validationState="error").' },
      successText: { control: { type: 'text' }, description: 'Success text (with validationState="success").' },
      validationState: {
        control: { type: 'select' },
        options: ['none', 'error', 'success'],
        description: 'Validation state.',
      },
      size: {
        control: { type: 'select' },
        options: ['medium', 'large'],
        description: 'Input size.',
      },
      accessibilityLabel: {
        control: { type: 'text' },
        description: 'Accessibility label (used when label is absent).',
      },
    },
  });
</script>

<script lang="ts">
  import Link from '../../Link/Link.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import Text from '../../Typography/Text/Text.svelte';
  import Button from '../../Button/Button.svelte';
  import { InfoIcon } from '../../Icons';

  type OTPInputInstance = { focus: (index?: number) => void };

  let controlledValue = $state('');
  let refInput: OTPInputInstance | undefined = $state();
  let focusOn = $state(0);
</script>

<!-- 1 -->
<Story name="OTPInput">
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 2 -->
<Story name="OTPInput with 4 Fields" args={{ otpLength: 4 }}>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 3 -->
<Story name="OTPInput with Help Text" args={{ helpText: 'Add a message here' }}>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 4 -->
<Story
  name="OTPInput without Label"
  args={{ label: undefined, accessibilityLabel: 'Enter OTP', helpText: 'Add a message here' }}
>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 5 -->
<Story name="OTPInput with Masked input" args={{ isMasked: true, otpLength: 4, label: 'Enter Pin' }}>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 6 -->
<Story name="OTPInput with error" args={{ validationState: 'error', errorText: 'Invalid message' }}>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 7 -->
<Story name="OTPInput with success" args={{ validationState: 'success', successText: 'Validated' }}>
  {#snippet template(args)}
    <div style={`max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}>
      <OTPInput {...args} />
    </div>
  {/snippet}
</Story>

<!-- 8 -->
<Story name="OTPInputSizes" args={{ helpText: 'Help Text' }}>
  {#snippet template(args)}
    <div
      style={`display: flex; flex-direction: column; max-width: ${args.otpLength === 4 ? '376px' : '568px'};`}
    >
      <Text size="large" marginBottom="spacing.2">Medium Size:</Text>
      <OTPInput {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">Large Size:</Text>
      <OTPInput {...args} size="large" />
    </div>
  {/snippet}
</Story>

<!-- 9 -->
<Story name="OTPInputUncontrolled" asChild>
  <OTPInput
    label="Enter OTP"
    name="otp"
    onChange={({ name, value }) => console.log({ name, value })}
  />
</Story>

<!-- 10 -->
<Story name="OTPInputControlled" asChild>
  <OTPInput
    label="Enter OTP"
    name="otp"
    value={controlledValue}
    onChange={({ value }) => (controlledValue = value ?? '')}
  />
</Story>

<!-- 11 -->
<Story name="OTP Input Ref" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-3);">
    <div
      style="max-width: 200px; display: flex; flex-direction: row; align-items: flex-end; gap: var(--spacing-3);"
    >
      <label style="display: flex; flex-direction: column; gap: var(--spacing-2);">
        <Text size="small">Item to focus</Text>
        <select bind:value={focusOn}>
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
      </label>
      <Button onClick={() => refInput?.focus(Number(focusOn))}>Focus</Button>
    </div>
    <div style="max-width: 376px;">
      <OTPInput
        bind:this={refInput}
        label="Enter OTP"
        name="otp"
        otpLength={4}
        onChange={({ name, value }) => console.log({ name, value })}
      />
    </div>
  </div>
</Story>

<!-- 12 -->
<Story name="OTPInput with Label Suffix & Trailing" asChild>
  <div style="max-width: 568px;">
    <OTPInput label="Enter OTP" name="otp" placeholder="Enter OTP">
      {#snippet labelSuffix()}
        <Tooltip content="Enter your OTP" placement="right">
          <div style="display: flex; align-items: center;">
            <InfoIcon size="small" color="surface.icon.gray.muted" />
          </div>
        </Tooltip>
      {/snippet}
      {#snippet labelTrailing()}
        <Link size="small" onClick={() => {}}>Learn more</Link>
      {/snippet}
    </OTPInput>
  </div>
</Story>

<!-- 13 -->
<Story name="Showcase - All Variants" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-8);">
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Basic Variants</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 568px;"><OTPInput label="Default" name="default" /></div>
        <div style="max-width: 568px;"><OTPInput label="With Value" value="123456" name="withValue" /></div>
        <div style="max-width: 568px;"><OTPInput label="With Help Text" helpText="This is a helpful message" name="withHelpText" /></div>
        <div style="max-width: 568px;"><OTPInput label="Disabled" isDisabled name="disabled" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Validation States</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 568px;"><OTPInput label="Error State" value="123456" validationState="error" errorText="Invalid OTP. Please try again" name="error" /></div>
        <div style="max-width: 568px;"><OTPInput label="Success State" value="123456" validationState="success" successText="OTP verified successfully" name="success" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Sizes</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 568px;"><OTPInput label="Medium Size" size="medium" name="sizeMedium" /></div>
        <div style="max-width: 568px;"><OTPInput label="Large Size" size="large" name="sizeLarge" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Label Positions</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 568px;"><OTPInput label="Label Top" labelPosition="top" name="labelTop" /></div>
        <div style="max-width: 568px;"><OTPInput label="Label Left" labelPosition="left" name="labelLeft" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">OTP Length</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 376px;"><OTPInput label="4 Digit OTP" otpLength={4} name="otpLength4" /></div>
        <div style="max-width: 568px;"><OTPInput label="6 Digit OTP" otpLength={6} name="otpLength6" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Masked Input</Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <div style="max-width: 376px;"><OTPInput label="Masked 4 Digit PIN" otpLength={4} isMasked name="masked4" /></div>
        <div style="max-width: 568px;"><OTPInput label="Masked 6 Digit OTP" otpLength={6} isMasked name="masked6" /></div>
      </div>
    </div>
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">Auto Focus</Text>
      <div style="max-width: 568px;"><OTPInput label="Auto Focus Enabled" autoFocus name="autoFocus" /></div>
    </div>
  </div>
</Story>
