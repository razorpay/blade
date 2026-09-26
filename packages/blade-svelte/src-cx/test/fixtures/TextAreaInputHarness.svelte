<script lang="ts">
  import TextAreaInput from '../../components/text-area-input/TextAreaInput.svelte';

  interface Props {
    value?: string;
    label?: string;
    onChange?: (value: string) => void;
    numberOfLines?: number;
    maxCharacters?: number;
    isDisabled?: boolean;
    validationState?: 'none' | 'error' | 'success';
    helpText?: string;
    errorText?: string;
    successText?: string;
    className?: string;
  }

  let {
    value = '',
    label = 'Delivery notes',
    onChange,
    numberOfLines,
    maxCharacters,
    isDisabled,
    validationState,
    helpText,
    errorText,
    successText,
    className,
  }: Props = $props();
</script>

<TextAreaInput
  {value}
  {label}
  {onChange}
  {numberOfLines}
  {maxCharacters}
  {isDisabled}
  {validationState}
  {helpText}
  {errorText}
  {successText}
  class={className}
  testID="solo"
/>
