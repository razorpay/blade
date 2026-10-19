<script lang="ts">
  import InputGroup from '../../components/input-group/InputGroup.svelte';
  import TextArea from '../../components/text-area/TextArea.svelte';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { InputGroupStyleProps } from '../../components/input-group';

  interface Props extends InputGroupStyleProps {
    helpText?: string;
    errorText?: string;
    successText?: string;
    isDisabled?: boolean;
    validationState?: 'none' | 'error' | 'success';
    /** A TextArea as the last member. */
    withTextArea?: boolean;
  }

  let {
    helpText,
    errorText,
    successText,
    isDisabled,
    validationState,
    withTextArea = false,
    ...styleProps
  }: Props = $props();
</script>

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
  {#if withTextArea}
    <TextArea name="notes" label="Notes" testID="notes" />
  {/if}
</InputGroup>
