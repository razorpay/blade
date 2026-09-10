<script module>
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
      type: 'url',
      size: 'medium',
      showClearButton: true,
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
      validationTextPlacement: {
        control: { type: 'select' },
        options: ['outside', 'inside'],
        description: 'Placement of validation (success/error) text relative to the input.',
        table: { defaultValue: { summary: 'outside' } },
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
  import Text from '../../Typography/Text/Text.svelte';
  import { InfoIcon, BankIcon, LockIcon, AlertTriangleIcon } from '../../Icons';

  let controlledValue = $state('');
  let inputInstance: { focus: () => void; getInput: () => HTMLInputElement | null } | undefined =
    $state();

  // State for the Formatted + Controlled bug-repro story.
  let cardValue = $state('');
  let cardLog = $state<string[]>([]);
  const onlyDigits = (v: string): string => v.replace(/\D/g, '');
  const cardPrefill = (raw: string): void => {
    cardValue = raw;
    cardLog = [`Prefilled → "${raw}"`, ...cardLog.slice(0, 4)];
  };
  const cardShorten = (): void => {
    cardValue = cardValue.slice(0, 12);
    cardLog = [`Shortened to 12 digits`, ...cardLog.slice(0, 4)];
  };
  const cardClear = (): void => {
    cardValue = '';
    cardLog = [`Cleared`, ...cardLog.slice(0, 4)];
  };

  // Controlled card form modeled on checkout's AddNewCard.svelte. Controlled
  // (value + onChange, not defaultValue) is required because the parent must
  // reset/prefill fields externally — NFC autofill writes number+expiry, and a
  // DCC provider switch (GPay/Apple Pay) clears every field. Uncontrolled
  // inputs would not reflect those external mutations.
  let checkoutNumber = $state('');
  let checkoutExpiry = $state('');
  let checkoutCvv = $state('');
  const digits = (v: string): string => v.replace(/\D/g, '');
  // Simulates registerNfcScanner autofill: sets number + expiry programmatically.
  const nfcAutofill = (): void => {
    checkoutNumber = '4111111111111111';
    checkoutExpiry = '1229';
  };
  // Simulates the international DCC provider switch: clears the whole form.
  const dccSwitch = (): void => {
    checkoutNumber = '';
    checkoutExpiry = '';
    checkoutCvv = '';
  };
</script>

<!-- 1 -->
<Story name="TextInput">
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 2 -->
<Story name="TextInput with type number" args={{ type: 'number', label: 'Enter Number', placeholder: 'Enter any random number' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 3 -->
<Story name="TextInput with Help Text" args={{ helpText: 'Please enter first and last name' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 4 -->
<Story name="TextInput with error" args={{ validationState: 'error', errorText: 'Name is not valid' }}>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 5 -->
<Story
  name="TextInput with success"
  args={{ defaultValue: 'John Ives', validationState: 'success', successText: 'Name validated' }}
>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 5a -->
<Story name="TextInput with validation text inside" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <TextInput
      label="Card Number"
      defaultValue="4111 1111 1111 1111"
      validationState="success"
      successText="Verified"
      validationTextPlacement="inside"
      showClearButton={false}
    />
    <TextInput
      label="Card Number"
      defaultValue="4111 1111 1111"
      validationState="error"
      errorText="Invalid"
      validationTextPlacement="inside"
      showClearButton={false}
    />
  </div>
</Story>

<!-- 5b -->
<Story name="TextInput validation placement (inside vs outside)" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-6);">
    <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
      <Text size="large" weight="semibold" marginBottom="spacing.2">Inside</Text>
      <TextInput label="Amount" defaultValue="1000" validationState="success" successText="Verified" validationTextPlacement="inside" trailingIcon={LockIcon} showClearButton={false} />
      <TextInput label="Amount" defaultValue="10" validationState="error" errorText="Too low" validationTextPlacement="inside" trailingIcon={AlertTriangleIcon} showClearButton={false} />
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
      <Text size="large" weight="semibold" marginBottom="spacing.2">Outside</Text>
      <TextInput label="Amount" defaultValue="1000" validationState="success" successText="Verified" validationTextPlacement="outside" trailingIcon={LockIcon} showClearButton={false} />
      <TextInput label="Amount" defaultValue="10" validationState="error" errorText="Too low" validationTextPlacement="outside" trailingIcon={AlertTriangleIcon} showClearButton={false} />
    </div>
  </div>
</Story>

<!-- 5c -->
<Story name="TextInput validation inside - sizes" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
    <TextInput size="small" label="Label" defaultValue="Value" validationState="success" successText="Success Text" validationTextPlacement="inside" showClearButton={false} />
    <TextInput size="medium" label="Label" defaultValue="Value" validationState="success" successText="Success Text" validationTextPlacement="inside" showClearButton={false} />
    <TextInput size="large" label="Label" defaultValue="Value" validationState="success" successText="Success Text" validationTextPlacement="inside" showClearButton={false} />
  </div>
</Story>

<!-- 6 -->
<Story
  name="TextInput without label"
  args={{ defaultValue: 'John Ives', label: undefined, accessibilityLabel: 'Enter your name' }}
>
  {#snippet template(args)}
    <TextInput {...args} />
  {/snippet}
</Story>

<!-- 7 -->
<Story name="TextInput with trailing action button" asChild>
  <TextInput label="Discount Code" placeholder="Enter your first and last name" defaultValue="John Ives" showClearButton={false}>
    {#snippet trailingButton()}
      <Link onClick={() => {}}>Apply</Link>
    {/snippet}
  </TextInput>
</Story>

<!-- 8 -->
<Story name="Text Input Max Characters" asChild>
  <TextInput label="First Name" defaultValue="John Ives" name="fullName" maxCharacters={10} />
</Story>

<!-- 9 -->
<Story name="Text Input Sizes" asChild>
  <div style="display: flex; flex-direction: column;">
    <Text size="large" marginBottom="spacing.2">Medium Size:</Text>
    <TextInput size="medium" label="Enter Name" placeholder="Enter your first and last name" />
    <Text size="large" marginTop="spacing.4" marginBottom="spacing.2">Large Size:</Text>
    <TextInput size="large" label="Enter Name" placeholder="Enter your first and last name" />
  </div>
</Story>

<!-- 10 -->
<Story name="Text Input Uncontrolled" asChild>
  <TextInput
    label="First Name"
    placeholder="Enter your first and last name"
    defaultValue="John Ives"
    name="fullName"
    onChange={(e) => console.log(e)}
  />
</Story>

<!-- 11 -->
<Story name="Text Input Controlled" asChild>
  <TextInput
    label="First Name"
    placeholder="Enter your first and last name"
    value={controlledValue}
    name="fullName"
    onChange={(e) => (controlledValue = e.value ?? '')}
  />
</Story>

<!-- 11a: manual test for controlled-value sync in format mode -->
<Story name="Text Input Formatted Controlled" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5); max-width: 400px;">
    <TextInput
      label="Card Number"
      format="#### #### #### #### ###"
      value={cardValue}
      onChange={({ rawValue }) => {
        const clean = onlyDigits(rawValue ?? '');
        cardValue = clean;
        cardLog = [`onChange rawValue="${rawValue}" → stored="${clean}"`, ...cardLog.slice(0, 4)];
      }}
    />
    <div style="display: flex; gap: var(--spacing-3); flex-wrap: wrap;">
      <Button size="small" onClick={() => cardPrefill('4111111111111111')}>Prefill Visa (16d)</Button>
      <Button size="small" onClick={() => cardPrefill('378282246310005')}>Prefill Amex (15d)</Button>
      <Button size="small" onClick={cardShorten}>Shorten (IIN sim)</Button>
      <Button size="small" onClick={cardClear}>Clear</Button>
    </div>
    <div style="font-family: monospace; font-size: 12px;">
      <div>stored: "{cardValue}"</div>
      {#each cardLog as entry}
        <div style="color: #888;">{entry}</div>
      {/each}
    </div>
    <div style="font-size: 12px; color: #888;">
      Type letters mixed with digits (e.g. 4111abcd2222) — letters must vanish from the field.
    </div>
  </div>
</Story>

<!-- 11b: controlled card form modeled on checkout AddNewCard.svelte -->
<Story name="Text Input Checkout Card (Controlled)" asChild>
  <div style="display: flex; flex-direction: column; gap: var(--spacing-5); max-width: 400px;">
    <TextInput
      label="Card Number"
      placeholder="Enter card number"
      type="telephone"
      format="#### #### #### #### ###"
      value={checkoutNumber}
      onChange={({ rawValue }) => (checkoutNumber = digits(rawValue ?? ''))}
    />
    <div style="display: flex; gap: var(--spacing-4);">
      <TextInput
        label="Expiry"
        placeholder="MM/YY"
        type="telephone"
        format="##/##"
        value={checkoutExpiry}
        onChange={({ rawValue }) => (checkoutExpiry = digits(rawValue ?? ''))}
      />
      <TextInput
        label="CVV"
        placeholder="CVV"
        type="telephone"
        maxCharacters={3}
        value={checkoutCvv}
        onChange={({ value }) => (checkoutCvv = digits(value ?? ''))}
      />
    </div>
    <div style="display: flex; gap: var(--spacing-3); flex-wrap: wrap;">
      <Button size="small" onClick={nfcAutofill}>NFC Autofill</Button>
      <Button size="small" variant="secondary" onClick={dccSwitch}>Switch to GPay (DCC)</Button>
    </div>
    <div style="font-family: monospace; font-size: 12px; color: #888;">
      number: "{checkoutNumber}" · expiry: "{checkoutExpiry}" · cvv: "{checkoutCvv}"
    </div>
  </div>
</Story>

<!-- 12 -->
<Story name="Text Input Kitchen Sink" asChild>
  <div>
    <div style="display: flex; gap: var(--spacing-5);">
      <TextInput showClearButton label="First Name" placeholder="Enter your first" name="fullName" />
      <TextInput label="First Name" placeholder="Enter your first" name="fullName" defaultValue="Anurag" />
      <TextInput
        validationState="error"
        label="First Name"
        placeholder="Enter your first"
        name="fullName"
        defaultValue="Anurag"
        errorText="Name is invalid"
      />
      <TextInput
        validationState="success"
        label="First Name"
        placeholder="Enter your first"
        name="fullName"
        defaultValue="Anurag"
        successText="Name is valid"
      />
    </div>
    <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
      <TextInput label="First Name" placeholder="Enter your first" name="fullName" maxCharacters={100} />
      <TextInput label="First Name" placeholder="Enter your first" name="fullName" />
      <TextInput label="First Name" placeholder="Enter your first" name="fullName" labelPosition="left" />
      <TextInput
        necessityIndicator="optional"
        label="First Name"
        placeholder="Enter your first"
        name="fullName"
        labelPosition="left"
        maxCharacters={100}
      />
      <TextInput
        necessityIndicator="required"
        label="First Name"
        placeholder="Enter your first"
        name="fullName"
        labelPosition="left"
        maxCharacters={100}
        validationState="none"
        helpText="Write your message"
      />
      <TextInput
        necessityIndicator="required"
        label="Enter Your Residential Address"
        placeholder="Enter your address"
        name="fullName"
        labelPosition="left"
        maxCharacters={100}
        validationState="none"
        helpText="Write your message"
      />
      <TextInput
        accessibilityLabel="Enter Your Residential Address"
        necessityIndicator="required"
        placeholder="Enter your address"
        name="fullName"
        labelPosition="left"
        maxCharacters={100}
        validationState="none"
        helpText="Write your message"
      />
    </div>
  </div>
</Story>

<!-- 13 -->
<Story name="Text Input Ref" asChild>
  <div style="display: flex; gap: var(--spacing-3); align-items: flex-end;">
    <TextInput bind:this={inputInstance} label="First Name" name="fullName" />
    <Button onClick={() => inputInstance?.focus()}>Click to focus the input</Button>
  </div>
</Story>

<!-- 14 -->
<Story name="Text Input With Leading Icon" asChild>
  <TextInput label="Enter your upi id" placeholder="98000xxxxx" leadingIcon={BankIcon} />
</Story>

<!-- 15 -->
<Story name="Text Input With Trailing Icon" asChild>
  <TextInput label="Enter your upi id" placeholder="98000xxxxx" trailingIcon={BankIcon} />
</Story>

<!-- 16 -->
<Story name="Text Input With Leading Element" asChild>
  <TextInput label="Enter your upi id" placeholder="98000xxxxx">
    {#snippet leading()}
      <Badge color="neutral">+91</Badge>
    {/snippet}
  </TextInput>
</Story>

<!-- 17 -->
<Story name="Text Input With Trailing Element" asChild>
  <TextInput label="Enter your upi id" placeholder="98000xxxxx">
    {#snippet trailing()}
      <Badge color="neutral">@oksbi</Badge>
    {/snippet}
  </TextInput>
</Story>

<!-- 18 -->
<Story name="TextInput with Label Suffix & Trailing" asChild>
  <TextInput label="Enter GSTIN" placeholder="Enter GSTIN">
    {#snippet labelSuffix()}
      <Tooltip content="Your GSTIN is used to generate invoices and receipts" placement="right">
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
  <div style="display: flex; flex-direction: column; gap: var(--spacing-8);">
    <!-- Basic Variants -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Basic Variants
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Default" placeholder="Enter text" name="default" />
        <TextInput label="With Value" defaultValue="John Doe" name="withValue" />
        <TextInput label="With Help Text" placeholder="Enter text" helpText="This is a helpful message" name="withHelpText" />
        <TextInput label="Disabled" placeholder="Enter text" isDisabled name="disabled" />
      </div>
    </div>

    <!-- Validation States -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Validation States
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput
          label="Error State"
          defaultValue="Invalid Input"
          validationState="error"
          errorText="This field has an error"
          name="error"
        />
        <TextInput
          label="Success State"
          defaultValue="Valid Input"
          validationState="success"
          successText="This field is valid"
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
        <TextInput label="Medium Size" placeholder="Medium size input" size="medium" name="sizeMedium" />
        <TextInput label="Large Size" placeholder="Large size input" size="large" name="sizeLarge" />
      </div>
    </div>

    <!-- Label Positions -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Label Positions
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Label Top" placeholder="Label on top" labelPosition="top" name="labelTop" />
        <TextInput label="Label Left" placeholder="Label on left" labelPosition="left" name="labelLeft" />
      </div>
    </div>

    <!-- Necessity Indicators -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Necessity Indicators
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Required Field" placeholder="Enter text" necessityIndicator="required" name="required" />
        <TextInput label="Optional Field" placeholder="Enter text" necessityIndicator="optional" name="optional" />
      </div>
    </div>

    <!-- With Icons -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Icons
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Leading Icon" placeholder="Enter text" leadingIcon={BankIcon} name="leadingIcon" />
        <TextInput label="Trailing Icon" placeholder="Enter text" trailingIcon={InfoIcon} name="trailingIcon" />
        <TextInput label="Both Icons" placeholder="Enter text" leadingIcon={BankIcon} trailingIcon={InfoIcon} name="bothIcons" />
      </div>
    </div>

    <!-- With Prefix/Suffix -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Prefix/Suffix
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="With Prefix" placeholder="Enter amount" prefix="₹" name="withPrefix" />
        <TextInput label="With Suffix" placeholder="Enter weight" suffix="kg" name="withSuffix" />
      </div>
    </div>

    <!-- Leading & Trailing Dropdowns: OMITTED — depends on Dropdown/InputDropdownButton (not migrated). -->

    <!-- With Elements -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Elements
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Leading Badge" placeholder="Enter phone" name="leadingBadge">
          {#snippet leading()}
            <Badge color="neutral">+91</Badge>
          {/snippet}
        </TextInput>
        <TextInput label="Trailing Badge" placeholder="Enter UPI" name="trailingBadge">
          {#snippet trailing()}
            <Badge color="neutral">@oksbi</Badge>
          {/snippet}
        </TextInput>
      </div>
    </div>

    <!-- With Trailing Button -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Trailing Button
      </Text>
      <TextInput label="Discount Code" placeholder="Enter code" showClearButton={false} name="trailingButton">
        {#snippet trailingButton()}
          <Link onClick={() => {}}>Apply</Link>
        {/snippet}
      </TextInput>
    </div>

    <!-- With Clear Button -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Clear Button
      </Text>
      <TextInput label="With Clear Button" defaultValue="Clear me" showClearButton name="clearButton" />
    </div>

    <!-- Loading State -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Loading State
      </Text>
      <TextInput label="Loading" placeholder="Enter text" isLoading name="loading" />
    </div>

    <!-- With Max Characters -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        With Max Characters
      </Text>
      <TextInput label="Max Characters" placeholder="Max 20 characters" maxCharacters={20} name="maxCharacters" />
    </div>

    <!-- Text Alignment -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="feedback.text.information.intense">
        Text Alignment
      </Text>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-5);">
        <TextInput label="Left Aligned" defaultValue="Left aligned text" textAlign="left" name="textAlignLeft" />
        <TextInput label="Center Aligned" defaultValue="Center aligned text" textAlign="center" name="textAlignCenter" />
        <TextInput label="Right Aligned" defaultValue="Right aligned text" textAlign="right" name="textAlignRight" />
      </div>
    </div>

    <!-- With Label Suffix & Trailing -->
    <div>
      <Text size="large" weight="semibold" marginBottom="spacing.4" color="surface.text.gray.subtle">
        With Label Suffix & Trailing
      </Text>
      <TextInput label="GSTIN" placeholder="Enter GSTIN" name="labelSuffixTrailing">
        {#snippet labelSuffix()}
          <Tooltip content="Your GSTIN is used to generate invoices" placement="right">
            <div style="display: flex; align-items: center;">
              <InfoIcon size="small" color="surface.icon.gray.muted" />
            </div>
          </Tooltip>
        {/snippet}
        {#snippet labelTrailing()}
          <Link size="small" onClick={() => {}}>Learn more</Link>
        {/snippet}
      </TextInput>
    </div>

    <!-- With Tags (Tagged Input): OMITTED — tagged-input path not migrated. -->
  </div>
</Story>
