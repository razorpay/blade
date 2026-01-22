<script lang="ts">
  import TextInput from './TextInput.svelte';
  import Text from '../../Typography/Text/Text.svelte';

  let pattern = $state('(####)-####-####');
  let value = $state('');
  let rawValue = $state('');

  const handlePatternChange = ({ value: newPattern }: { name?: string; value?: string }) => {
    pattern = newPattern ?? '';
    value = '';
    rawValue = '';
  };

  const handleValueChange = ({ value: newValue, rawValue: newRawValue }: { name?: string; value?: string; rawValue?: string }) => {
    value = newValue ?? '';
    rawValue = newRawValue ?? '';
  };

  const handleClear = () => {
    value = '';
    rawValue = '';
  };
</script>

<div class="display-flex flex-col gap-y-spacing-4">
  <TextInput
    label="Format Pattern"
    placeholder="Enter format pattern (use # for input positions)"
    value={pattern}
    onChange={handlePatternChange}
    helpText="Example patterns: ####-####-####, (###) ###-####, ##/##/####"
  />
  
  <TextInput
    label="Formatted Input"
    placeholder="Enter value"
    {value}
    format={pattern}
    onChange={handleValueChange}
    helpText="Enter value to see it formatted according to the pattern above"
    showClearButton={true}
    onClearButtonClick={handleClear}
  />
  
  <div>
    <Text>Formatted Value: {value}</Text>
  </div>
  
  <div>
    <Text>Raw Value: {rawValue}</Text>
  </div>
</div>

