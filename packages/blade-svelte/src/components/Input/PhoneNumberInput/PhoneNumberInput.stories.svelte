<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PhoneNumberInput from './PhoneNumberInput.svelte';

  const { Story } = defineMeta({
    title: 'Components/Input/PhoneNumberInput',
    component: PhoneNumberInput,
    tags: ['autodocs'],
    args: {
      label: 'Enter phone number',
      defaultCountry: 'IN',
      size: 'medium',
      showDialCode: true,
      showCountrySelector: true,
      name: 'phonenumber',
    },
    argTypes: {
      label: { control: { type: 'text' }, description: 'Label of the input.' },
      defaultCountry: { control: { type: 'text' }, description: 'Default country (uncontrolled).' },
      showDialCode: { control: { type: 'boolean' }, description: 'Shows the dial code prefix.' },
      showCountrySelector: {
        control: { type: 'boolean' },
        description: 'Shows the country selector.',
      },
      helpText: { control: { type: 'text' }, description: 'Help text below the input.' },
      errorText: { control: { type: 'text' }, description: 'Error text.' },
      successText: { control: { type: 'text' }, description: 'Success text.' },
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
      isDisabled: { control: { type: 'boolean' }, description: 'Disables the input.' },
      accessibilityLabel: {
        control: { type: 'text' },
        description: 'Accessibility label (used when label is absent).',
      },
    },
  });
</script>

<script lang="ts">
  import type { CountryCodeType } from '@razorpay/i18nify-js';
  import { isValidPhoneNumber } from '@razorpay/i18nify-js';
  import Link from '../../Link/Link.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import Text from '../../Typography/Text/Text.svelte';
  import Code from '../../Typography/Code/Code.svelte';
  import Button from '../../Button/Button.svelte';
  import { InfoIcon, UserIcon } from '../../Icons';
  import type { PhoneNumberChangePayload } from './types';

  let controlledCountry = $state<CountryCodeType>('IN');
  let controlledValue = $state('');
  let changeData = $state<PhoneNumberChangePayload | null>(null);
  let validationValue = $state('');
  let isValid = $state(true);
</script>

<!-- 1 -->
<Story name="Default">
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="Size: Large" args={{ size: 'large' }}>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story name="WithoutCountrySelector" args={{ showCountrySelector: false }}>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="WithoutDialCode" args={{ showDialCode: false }}>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 5 -->
<Story
  name="WithHelpText"
  args={{ helpText: 'Phone number is needed for sending you invoice' }}
>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 6 -->
<Story name="WithErrorText" args={{ validationState: 'error', errorText: 'Phone number is invalid' }}>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 7 -->
<Story
  name="WithSuccessText"
  args={{ validationState: 'success', successText: 'Phone number is valid' }}
>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 8 -->
<Story
  name="WithoutLabel"
  args={{ label: undefined, accessibilityLabel: 'Enter your phone number' }}
>
  {#snippet template(args)}
    <PhoneNumberInput {...args} />
  {/snippet}
</Story>

<!-- 9 -->
<Story name="WithLeadingIcon" asChild>
  <PhoneNumberInput label="Enter phone number" showCountrySelector={false} leadingIcon={UserIcon} />
</Story>

<!-- 10 -->
<Story name="PhoneNumberInput with Label Suffix & Trailing" asChild>
  <PhoneNumberInput label="Enter phone number" placeholder="Enter phone number">
    {#snippet labelSuffix()}
      <Tooltip content="Enter your phone number" placement="right">
        <div style="display: flex; align-items: center;">
          <InfoIcon size="small" color="surface.icon.gray.muted" />
        </div>
      </Tooltip>
    {/snippet}
    {#snippet labelTrailing()}
      <Link size="small" onClick={() => {}}>Learn more</Link>
    {/snippet}
  </PhoneNumberInput>
</Story>

<!-- 11 -->
<Story name="CountriesToShow" asChild>
  <div>
    <Text marginBottom="spacing.5">
      By setting the <Code size="medium">{`allowedCountries={['IN', 'MY']}`}</Code> prop, We can only
      show two countries in the Country Selector
    </Text>
    <PhoneNumberInput label="Enter phone number" allowedCountries={['IN', 'MY']} />
  </div>
</Story>

<!-- 12 -->
<Story name="DefaultCountry" asChild>
  <PhoneNumberInput label="Enter phone number" defaultCountry="MY" />
</Story>

<!-- 13 -->
<Story name="ControlledCountrySelector" asChild>
  <div>
    <Button
      size="small"
      variant="tertiary"
      marginBottom="spacing.4"
      onClick={() => (controlledCountry = 'US')}
    >
      Change Country
    </Button>
    <Text marginBottom="spacing.4">Selected country: {controlledCountry}</Text>
    <PhoneNumberInput
      label="Enter phone number"
      name="phonenumber"
      country={controlledCountry}
      onCountryChange={({ country }) => (controlledCountry = country)}
    />
  </div>
</Story>

<!-- 14 -->
<Story name="Controlled" asChild>
  <div>
    <PhoneNumberInput
      label="Enter phone number"
      value={controlledValue}
      name="phonenumber"
      onChange={(payload) => {
        controlledValue = payload.value ?? '';
        changeData = payload;
      }}
    />
    {#if changeData}
      <div style="margin-top: var(--spacing-4);">
        <Text><Text as="span" weight="semibold">value:</Text> {changeData.value}</Text>
        <Text><Text as="span" weight="semibold">phoneNumber:</Text> {changeData.phoneNumber}</Text>
        <Text><Text as="span" weight="semibold">country:</Text> {changeData.country}</Text>
        <Text><Text as="span" weight="semibold">dialCode:</Text> {changeData.dialCode}</Text>
        <Text><Text as="span" weight="semibold">name:</Text> {changeData.name}</Text>
      </div>
    {/if}
  </div>
</Story>

<!-- 15 -->
<Story name="Validation" asChild>
  <div>
    <Text marginBottom="spacing.5">
      You can choose to validate the phone number manually by using the i18nify-js library's
      <Code size="medium">isValidPhoneNumber()</Code> utility.
    </Text>
    <PhoneNumberInput
      label="Enter phone number"
      value={validationValue}
      name="phonenumber"
      errorText="Invalid phone number"
      validationState={isValid ? 'none' : 'error'}
      onChange={({ value, country }) => {
        validationValue = value ?? '';
        isValid = isValidPhoneNumber(value ?? '', country);
      }}
    />
  </div>
</Story>
