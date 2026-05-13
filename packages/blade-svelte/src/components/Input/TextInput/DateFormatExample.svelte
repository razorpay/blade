<script lang="ts">
  import TextInput from './TextInput.svelte';
  import Text from '../../Typography/Text/Text.svelte';

  let date = $state('');
  let rawDate = $state('');
  let validationState = $state<'none' | 'error'>('none');
  let errorText = $state('');

  const validateNumber = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  const handleChange = ({ value, rawValue }: { name?: string; value?: string; rawValue?: string }) => {
    const isValidNumber = validateNumber(rawValue ?? '');

    if (!isValidNumber && rawValue) {
      validationState = 'error';
      errorText = 'Please enter numbers only';
    } else {
      validationState = 'none';
      errorText = '';
    }

    date = value ?? '';
    rawDate = rawValue ?? '';
  };
</script>

<div class="display-flex flex-col gap-y-spacing-4">
  <TextInput
    label="Date"
    placeholder="Enter date"
    defaultValue=""
    format="##/##/####"
    onChange={handleChange}
    helpText="Enter date in DD/MM/YYYY format"
    {validationState}
    {errorText}
  />
  
  <div>
    <Text>Formatted Value: {date}</Text>
  </div>
  
  <div>
    <Text>Raw Value: {rawDate}</Text>
  </div>
</div>


