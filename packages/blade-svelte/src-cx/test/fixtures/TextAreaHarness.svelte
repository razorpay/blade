<script lang="ts">
  import TextArea from '../../components/text-area/TextArea.svelte';

  interface Props {
    value?: string;
    label?: string;
    onChange?: (change: { name: string | undefined; value: string }) => void;
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

<TextArea
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
