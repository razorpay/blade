<script lang="ts">
  import Button from '../../components/button/Button.svelte';
  import Form from '../../components/form/Form.svelte';
  import InputGroup from '../../components/input-group/InputGroup.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { InputGroupStyleProps } from '../../components/input-group';

  interface Props extends InputGroupStyleProps {
    helpText?: string;
    errorText?: string;
    successText?: string;
    isDisabled?: boolean;
    validationState?: 'none' | 'error' | 'success';
  }

  let {
    helpText,
    errorText,
    successText,
    isDisabled,
    validationState,
    ...styleProps
  }: Props = $props();
</script>

<Form
  name="card"
  formatConstraintError={(code, field) => `${field.name}:${code}`}
>
  <InputGroup
    label="Card details"
    {helpText}
    {errorText}
    {successText}
    {isDisabled}
    {validationState}
    testID="group"
    {...styleProps}
  >
    <TextInput name="number" label="Card number" testID="number" />
    <TextInput name="expiry" label="Expiry" span="2/3" testID="expiry" />
    <TextInput name="cvv" label="CVV" span="1/3" isRequired testID="cvv" />
  </InputGroup>
  <Button testID="pay">Pay</Button>
</Form>
