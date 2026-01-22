<script lang="ts">
  import TextInput from './TextInput.svelte';
  import Text from '../../Typography/Text/Text.svelte';

  let cardNumber = $state('');
  let rawCardNumber = $state('');
  let validationState = $state<'none' | 'error'>('none');
  let errorText = $state('');

  const validateNumber = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const handleCardNumberChange = ({ value, rawValue }: { name?: string; value?: string; rawValue?: string }) => {
    const isValidNumber = validateNumber(rawValue ?? '');

    if (!isValidNumber && rawValue) {
      validationState = 'error';
      errorText = 'Please enter numbers only';
    } else {
      validationState = 'none';
      errorText = '';
    }

    cardNumber = value ?? '';
    rawCardNumber = rawValue ?? '';
  };
</script>

<div class="display-flex flex-col gap-y-spacing-4">
  <TextInput
    label="Card Number"
    placeholder="Enter card number"
    value={cardNumber}
    format="#### #### #### ####"
    onChange={handleCardNumberChange}
    helpText="Try: 4111111111111111 (Visa), 5555555555554444 (Mastercard), 378282246310005 (Amex)"
    {validationState}
    {errorText}
  />
  
  <div>
    <Text>Formatted Value: {cardNumber}</Text>
  </div>
  
  <div>
    <Text>Raw Value: {rawCardNumber}</Text>
  </div>
</div>

