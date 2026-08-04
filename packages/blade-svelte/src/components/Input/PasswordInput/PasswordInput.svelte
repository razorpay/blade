<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import CharacterCounter from '../_Form/CharacterCounter.svelte';
  import IconButton from '../../Button/IconButton/IconButton.svelte';
  import { EyeIcon, EyeOffIcon } from '../../Icons';
  import { useFormId } from '../BaseInput/useFormId';
  import type { PasswordInputProps } from './types';

  let {
    label,
    accessibilityLabel,
    labelPosition = 'top',
    labelSuffix,
    labelTrailing,
    showRevealButton = true,
    necessityIndicator = 'none',
    autoCompleteSuggestionType,
    maxCharacters,
    validationState = 'none',
    errorText,
    successText,
    helpText,
    isDisabled = false,
    defaultValue,
    placeholder,
    isRequired = false,
    value,
    onChange,
    onFocus,
    onBlur,
    name,
    autoFocus = false,
    keyboardReturnKeyType = 'done',
    size = 'medium',
    testID,
    ...rest
  }: PasswordInputProps = $props();

  let baseInput = $state<{ focus: () => void; getInput: () => HTMLInputElement | null } | null>(
    null,
  );

  // If input is disabled the reveal button is hidden and the input stays masked.
  let isRevealed = $state(false);
  const isRevealedAndEnabled = $derived(isRevealed && !isDisabled);
  const inputType = $derived(isRevealedAndEnabled ? 'text' : 'password');
  const iconAccessibilityLabel = $derived(isRevealedAndEnabled ? 'Hide password' : 'Show password');

  const toggleIsRevealed = () => {
    isRevealed = !isRevealed;
  };

  const showRevealInteraction = $derived(showRevealButton && !isDisabled);

  export function focus(): void {
    baseInput?.focus();
  }
  export function getInput(): HTMLInputElement | null {
    return baseInput?.getInput() ?? null;
  }

  const ids = useFormId('passwordinput');
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet revealButton()}
  <IconButton
    size="medium"
    icon={isRevealedAndEnabled ? EyeOffIcon : EyeIcon}
    accessibilityLabel={iconAccessibilityLabel}
    onClick={toggleIsRevealed}
  />
{/snippet}

{#snippet footerCounter(currentValue: string | undefined)}
  {#if maxCharacters}
    <CharacterCounter currentCount={currentValue?.length ?? 0} maxCount={maxCharacters} {size} />
  {/if}
{/snippet}

<BaseInput
  bind:this={baseInput}
  id={ids.baseId}
  componentName="password-input"
  label={label ?? ''}
  hideLabelText={!label}
  {accessibilityLabel}
  {labelPosition}
  {labelSuffix}
  {labelTrailing}
  {necessityIndicator}
  type={inputType}
  {placeholder}
  {defaultValue}
  {value}
  {name}
  {maxCharacters}
  {onChange}
  {onFocus}
  {onBlur}
  {isDisabled}
  {isRequired}
  trailingInteractionElement={showRevealInteraction ? revealButton : undefined}
  trailingFooterSlot={footerCounter}
  {validationState}
  {errorText}
  {successText}
  {helpText}
  {size}
  {autoFocus}
  {keyboardReturnKeyType}
  {autoCompleteSuggestionType}
  autoCapitalize="none"
  {testID}
  {...analyticsAttrs}
  {...rest}
/>
