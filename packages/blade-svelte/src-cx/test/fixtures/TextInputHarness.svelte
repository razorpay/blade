<script lang="ts">
  import type { FormatSpec } from '../../runes';
  import TextInput from '../../components/text-input/TextInput.svelte';
  import type { IconSource } from '../../runes/icon/source';

  type Value = string | number | null | undefined;

  interface Props {
    value?: Value;
    label?: string;
    accessibilityLabel?: string;
    onChange?: (change: { name: string | undefined; value: Value }) => void;
    isDisabled?: boolean;
    validationState?: 'none' | 'error' | 'success';
    helpText?: string;
    errorText?: string;
    successText?: string;
    format?:
      | FormatSpec
      | { parse: (value: Value) => Value; format: (value: Value) => string };
    maxCharacters?: number;
    prefix?: string;
    suffix?: string;
    leadingIcon?: IconSource;
    trailingIcon?: IconSource;
    withLeadingSnippet?: boolean;
    size?: 'small' | 'medium' | 'large';
    showClearButton?: boolean;
    type?: 'text' | 'tel' | 'email' | 'url' | 'number' | 'password';
    inputMode?: 'numeric' | 'decimal';
    enterKeyHint?: 'next' | 'done';
    autoComplete?: 'cc-number' | 'off';
    withTrailingSnippet?: boolean;
    className?: string;
  }

  let {
    value = '',
    label,
    accessibilityLabel,
    onChange,
    isDisabled,
    validationState,
    helpText,
    errorText,
    successText,
    format,
    maxCharacters,
    prefix,
    suffix,
    leadingIcon,
    trailingIcon,
    withLeadingSnippet = false,
    size,
    showClearButton,
    type,
    inputMode,
    enterKeyHint,
    autoComplete,
    withTrailingSnippet = false,
    className,
  }: Props = $props();
</script>

{#snippet clear()}
  <button data-testid="clear">Clear</button>
{/snippet}

{#snippet picker()}
  <button data-testid="picker">INR</button>
{/snippet}

<TextInput
  {value}
  {label}
  {accessibilityLabel}
  {onChange}
  {isDisabled}
  {validationState}
  {helpText}
  {errorText}
  {successText}
  {format}
  {maxCharacters}
  {prefix}
  {suffix}
  {leadingIcon}
  {trailingIcon}
  {size}
  {showClearButton}
  leading={withLeadingSnippet ? picker : undefined}
  {type}
  {inputMode}
  {enterKeyHint}
  {autoComplete}
  trailing={withTrailingSnippet ? clear : undefined}
  class={className}
  testID="solo"
/>
