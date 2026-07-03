<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InputGroup from './InputGroup.svelte';

  const { Story } = defineMeta({
    title: 'Components/InputGroup',
    component: InputGroup,
    tags: ['autodocs'],
    args: {
      label: 'Shipping Address',
      helpText: 'Where should we deliver your order?',
      labelPosition: 'top',
      size: 'medium',
      validationState: 'none',
      isDisabled: false,
    },
    argTypes: {
      label: { control: { type: 'text' }, description: 'Label for the entire input group.' },
      helpText: {
        control: { type: 'text' },
        description: 'Help text displayed at the bottom of the group.',
      },
      errorText: {
        control: { type: 'text' },
        description: 'Error message shown when validationState is "error".',
      },
      successText: {
        control: { type: 'text' },
        description: 'Success message shown when validationState is "success".',
      },
      validationState: {
        control: { type: 'select' },
        options: ['none', 'error', 'success'],
        description: 'Validation state of the input group.',
        table: { defaultValue: { summary: 'none' } },
      },
      labelPosition: {
        control: { type: 'select' },
        options: ['top', 'left'],
        description: 'Position of the label relative to the group (left is desktop-only).',
        table: { defaultValue: { summary: 'top' } },
      },
      size: {
        control: { type: 'select' },
        options: ['medium', 'large'],
        description: 'Size of the input group and its child inputs.',
        table: { defaultValue: { summary: 'medium' } },
      },
      isDisabled: {
        control: { type: 'boolean' },
        description: 'Disables all inputs within the group.',
        table: { defaultValue: { summary: 'false' } },
      },
    },
  });
</script>

<script lang="ts">
  import InputRow from './InputRow.svelte';
  import TextInput from '../Input/TextInput/TextInput.svelte';
  import Button from '../Button/Button.svelte';
  import Heading from '../Typography/Heading/Heading.svelte';
  import ToastContainer from '../Toast/ToastContainer.svelte';
  import { useToast } from '../Toast/useToast';

  const toast = useToast();

  // ── Story: Responsive Form ── mobile → single column, desktop → multi column.
  let isMobile = $state(false);
  $effect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = (): void => {
      isMobile = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  });

  // ── Story: All Variants ── size × label-position matrix (mirrors React).
  const variants = [
    { size: 'medium', labelPosition: 'top' },
    { size: 'large', labelPosition: 'left' },
  ] as const;

  // ── Story: With Validation ── controlled payment form (card-detection dropped).
  type ValidationField = 'cardNumber' | 'expiryDate' | 'cvv' | 'cardholderName' | 'email';
  let validationForm = $state<Record<ValidationField, string>>({
    cardNumber: '12345678',
    expiryDate: '12',
    cvv: '12',
    cardholderName: 'John Doe',
    email: 'invalid-email',
  });
  let validationErrors = $state<Record<ValidationField, boolean>>({
    cardNumber: true,
    expiryDate: true,
    cvv: true,
    cardholderName: false,
    email: true,
  });
  const hasValidationErrors = $derived(Object.values(validationErrors).some(Boolean));
  const setValidationField = (field: ValidationField, value: string): void => {
    validationForm = { ...validationForm, [field]: value };
    if (validationErrors[field]) validationErrors = { ...validationErrors, [field]: false };
  };
  const submitValidation = (): void => {
    const next: Record<ValidationField, boolean> = {
      cardNumber: !validationForm.cardNumber || validationForm.cardNumber.length < 13,
      expiryDate: !validationForm.expiryDate,
      cvv: !validationForm.cvv || validationForm.cvv.length !== 3,
      cardholderName: !validationForm.cardholderName,
      email: !validationForm.email || !/\S+@\S+\.\S+/.test(validationForm.email),
    };
    validationErrors = next;
    if (!Object.values(next).some(Boolean)) {
      toast.show({ content: 'Payment information saved successfully!', color: 'positive' });
    }
  };
  const validationStateFor = (field: ValidationField): 'error' | 'none' =>
    validationErrors[field] ? 'error' : 'none';

  // ── Story: Input Group With Format ── controlled form with format masks.
  type FormatField = 'cardNumber' | 'expiryDate' | 'cvv' | 'cardholderName';
  let formatForm = $state<Record<FormatField, string>>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  let formatErrors = $state<Record<string, string>>({});
  const hasFormatErrors = $derived(Object.values(formatErrors).some((e) => e !== ''));
  const setFormatField = (field: FormatField, value: string): void => {
    formatForm = { ...formatForm, [field]: value };
    if (formatErrors[field]) formatErrors = { ...formatErrors, [field]: '' };
  };
  const submitFormat = (): void => {
    const digits = (v: string): string => v.replace(/\D/g, '');
    const next: Record<FormatField, string> = {
      cardNumber: !formatForm.cardNumber.trim()
        ? 'Card number is required'
        : digits(formatForm.cardNumber).length < 13
          ? 'Card number incomplete'
          : '',
      expiryDate: !formatForm.expiryDate.trim()
        ? 'Expiry date is required'
        : digits(formatForm.expiryDate).length !== 4
          ? 'Invalid format'
          : '',
      cvv: !formatForm.cvv.trim() ? 'CVV is required' : formatForm.cvv.length !== 3 ? 'CVV must be 3 digits' : '',
      cardholderName: !formatForm.cardholderName.trim() ? 'Name is required' : '',
    };
    formatErrors = next;
    if (!Object.values(next).some((e) => e !== '')) {
      toast.show({
        content: `Payment method added! Card ending in ${formatForm.cardNumber.slice(-4)}`,
        color: 'positive',
      });
      formatForm = { cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' };
      formatErrors = {};
    } else {
      toast.show({ content: 'Please fix all errors before submitting', color: 'negative' });
    }
  };
  const formatStateFor = (field: FormatField): 'error' | 'none' =>
    formatErrors[field] ? 'error' : 'none';
</script>

<!-- 1. Default -->
<Story name="Default">
  {#snippet template({ children: _children, ...args })}
    <InputGroup {...args}>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Street Address" label="Street Address" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput placeholder="City" label="City" />
        <TextInput placeholder="ZIP Code" label="ZIP Code" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Country" label="Country" />
      </InputRow>
    </InputGroup>
  {/snippet}
</Story>

<!-- 2. Detailed -->
<Story
  name="Detailed"
  args={{ label: 'Billing Address', helpText: 'Complete address information required for billing' }}
>
  {#snippet template({ children: _children, ...args })}
    <InputGroup {...args}>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput placeholder="First Name" label="First Name" />
        <TextInput placeholder="Last Name" label="Last Name" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Street Address" label="Street Address" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Street Address Line-2" label="Address Line 2" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Apartment Name" label="Apartment Name" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput placeholder="City" label="City" />
        <TextInput placeholder="State" label="State" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput placeholder="ZIP Code" label="ZIP Code" />
        <TextInput placeholder="Country" label="Country" />
      </InputRow>
    </InputGroup>
  {/snippet}
</Story>

<!-- 3. Responsive Form -->
<Story name="Responsive Form" asChild>
  <div>
    <InputGroup
      label="Merchant Onboarding"
      helpText="Complete your business details to start accepting payments"
    >
      {#if isMobile}
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="Business Name" label="Business Name" />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="Trading Name" label="Trading Name" />
        </InputRow>
      {:else}
        <InputRow gridTemplateColumns="1fr 1fr">
          <TextInput placeholder="Business Name" label="Business Name" />
          <TextInput placeholder="Trading Name" label="Trading Name" />
        </InputRow>
      {/if}
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Business Email" label="Business Email" />
      </InputRow>
      {#if isMobile}
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="PAN Number" label="Business PAN" />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="GST Number" label="GSTIN" />
        </InputRow>
      {:else}
        <InputRow gridTemplateColumns="1fr 1fr">
          <TextInput placeholder="PAN Number" label="Business PAN" />
          <TextInput placeholder="GST Number" label="GSTIN" />
        </InputRow>
      {/if}
      {#if isMobile}
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="Account Number" label="Bank Account Number" />
        </InputRow>
        <InputRow gridTemplateColumns="1fr">
          <TextInput placeholder="IFSC Code" label="IFSC Code" />
        </InputRow>
      {:else}
        <InputRow gridTemplateColumns="2fr 1fr">
          <TextInput placeholder="Account Number" label="Bank Account Number" />
          <TextInput placeholder="IFSC Code" label="IFSC Code" />
        </InputRow>
      {/if}
    </InputGroup>
    <div style="display: flex; justify-content: flex-end; width: 100%;">
      <Button variant="primary" marginTop="spacing.3">Start Onboarding</Button>
    </div>
  </div>
</Story>

<!-- 4. With Validation -->
<Story name="With Validation" asChild>
  <div>
    <ToastContainer />
    <InputGroup
      label="Payment & Billing Information"
      helpText="Complete all fields to process your payment"
      validationState={hasValidationErrors ? 'error' : 'none'}
      errorText={hasValidationErrors ? 'Please fix all errors before submitting' : ''}
    >
      <InputRow gridTemplateColumns="1fr">
        <TextInput
          placeholder="Card Number"
          label="Card Number"
          value={validationForm.cardNumber}
          onChange={({ value }) => setValidationField('cardNumber', value ?? '')}
          validationState={validationStateFor('cardNumber')}
        />
      </InputRow>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput
          placeholder="Expiry Date"
          label="Expiry Date"
          format="##/##"
          value={validationForm.expiryDate}
          onChange={({ value }) => setValidationField('expiryDate', value ?? '')}
          validationState={validationStateFor('expiryDate')}
        />
        <!-- PasswordInput not migrated → TextInput substitute. -->
        <TextInput
          placeholder="CVV"
          label="CVV"
          value={validationForm.cvv}
          onChange={({ value }) => setValidationField('cvv', value ?? '')}
          validationState={validationStateFor('cvv')}
          maxCharacters={3}
        />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput
          placeholder="Cardholder Name"
          label="Cardholder Name"
          value={validationForm.cardholderName}
          onChange={({ value }) => setValidationField('cardholderName', value ?? '')}
          validationState={validationStateFor('cardholderName')}
        />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput
          placeholder="Email Address"
          label="Email Address"
          value={validationForm.email}
          onChange={({ value }) => setValidationField('email', value ?? '')}
          validationState={validationStateFor('email')}
        />
      </InputRow>
    </InputGroup>
    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: var(--spacing-4);">
      <Button variant="primary" onClick={submitValidation}>Submit Payment</Button>
    </div>
  </div>
</Story>

<!-- 5. All Variants -->
<Story name="All Variants" asChild>
  <div>
    {#each variants as variant}
      <div style="margin-bottom: var(--spacing-8);">
        <Heading marginBottom="spacing.3">
          Size: {variant.size} & Label Position: {variant.labelPosition}
        </Heading>
        <InputGroup
          label="Shipping Address"
          helpText="Where should we deliver your order?"
          size={variant.size}
          labelPosition={variant.labelPosition}
        >
          <InputRow gridTemplateColumns="1fr">
            <TextInput placeholder="Street Address" label="Street Address" />
          </InputRow>
          <InputRow gridTemplateColumns="1fr 1fr">
            <TextInput placeholder="City" label="City" />
            <TextInput placeholder="ZIP Code" label="ZIP Code" />
          </InputRow>
          <InputRow gridTemplateColumns="1fr">
            <TextInput placeholder="Country" label="Country" />
          </InputRow>
        </InputGroup>
      </div>
    {/each}
  </div>
</Story>

<!-- 6. Disabled -->
<Story
  name="Disabled"
  args={{
    label: 'Shipping Address (Read Only)',
    helpText: 'This address cannot be modified',
    isDisabled: true,
  }}
>
  {#snippet template({ children: _children, ...args })}
    <InputGroup {...args}>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Street Address" label="Street Address" value="123 Main Street" />
      </InputRow>
      <InputRow gridTemplateColumns="2fr 1fr">
        <TextInput placeholder="City" label="City" value="San Francisco" />
        <TextInput placeholder="ZIP Code" label="ZIP Code" value="94102" />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput placeholder="Country" label="Country" value="United States" />
      </InputRow>
    </InputGroup>
  {/snippet}
</Story>

<!-- 7. Input Group With Format -->
<Story name="Input Group With Format" asChild>
  <div>
    <ToastContainer />
    <InputGroup
      label="Payment Information"
      helpText="Enter your card details to add a payment method"
      validationState={hasFormatErrors ? 'error' : 'none'}
      errorText={hasFormatErrors ? 'Please fix all errors before submitting' : ''}
    >
      <InputRow gridTemplateColumns="1fr">
        <TextInput
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={formatForm.cardNumber}
          format="#### #### #### ####"
          onChange={({ value }) => setFormatField('cardNumber', value ?? '')}
          validationState={formatStateFor('cardNumber')}
        />
      </InputRow>
      <InputRow gridTemplateColumns="1fr 1fr">
        <TextInput
          label="Expiry Date"
          placeholder="MM/YY"
          value={formatForm.expiryDate}
          format="##/##"
          onChange={({ value }) => setFormatField('expiryDate', value ?? '')}
          validationState={formatStateFor('expiryDate')}
        />
        <!-- PasswordInput not migrated → TextInput substitute. -->
        <TextInput
          label="CVV (3 digits)"
          placeholder="123"
          maxCharacters={3}
          value={formatForm.cvv}
          onChange={({ value }) => setFormatField('cvv', value ?? '')}
          validationState={formatStateFor('cvv')}
        />
      </InputRow>
      <InputRow gridTemplateColumns="1fr">
        <TextInput
          label="Cardholder Name"
          placeholder="John Doe"
          value={formatForm.cardholderName}
          onChange={({ value }) => setFormatField('cardholderName', value ?? '')}
          validationState={formatStateFor('cardholderName')}
        />
      </InputRow>
    </InputGroup>
    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: var(--spacing-4);">
      <Button variant="primary" onClick={submitFormat}>Add Payment Method</Button>
    </div>
  </div>
</Story>
