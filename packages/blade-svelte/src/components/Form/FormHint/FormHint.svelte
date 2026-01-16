<script lang="ts">
  import type { FormHintProps } from './types';
  import Text from '../../Typography/Text/Text.svelte';
  import { InfoIcon, CheckIcon } from '../../Icons';
  import {
    hintTextSize,
    hintIconSize,
    getFormHintClasses,
    getHintIconClasses,
  } from '@razorpay/blade-core/styles';

  let {
    type,
    helpText,
    errorText,
    successText,
    helpTextId,
    errorTextId,
    successTextId,
    size = 'medium',
  }: FormHintProps = $props();

  // Text sizes based on size prop
  const textSize = $derived(hintTextSize[size] as 'small' | 'medium');
  const iconSize = $derived(hintIconSize[size] as 'small' | 'medium');

  // Determine what to show
  const showError = $derived(type === 'error' && errorText);
  const showSuccess = $derived(type === 'success' && successText);
  const showHelp = $derived(!showError && !showSuccess && helpText);

  // CSS classes
  const hintClasses = $derived(getFormHintClasses({ size }));
  const iconClasses = getHintIconClasses();

  // Color mappings
  const colors = {
    help: 'surface.text.gray.muted',
    error: 'feedback.text.negative.intense',
    success: 'feedback.text.positive.intense',
  } as const;
</script>

{#if showHelp}
  <div class={hintClasses} id={helpTextId}>
    <Text
      variant="caption"
      size={textSize}
      weight="regular"
      color={colors.help}
    >
      {helpText}
    </Text>
  </div>
{/if}

{#if showError}
  <div class={hintClasses} id={errorTextId}>
    <div class={iconClasses}>
      <InfoIcon
        size={iconSize}
        color="feedback.icon.negative.intense"
      />
    </div>
    <Text
      variant="caption"
      size={textSize}
      weight="regular"
      color={colors.error}
    >
      {errorText}
    </Text>
  </div>
{/if}

{#if showSuccess}
  <div class={hintClasses} id={successTextId}>
    <div class={iconClasses}>
      <CheckIcon
        size={iconSize}
        color="feedback.icon.positive.intense"
      />
    </div>
    <Text
      variant="caption"
      size={textSize}
      weight="regular"
      color={colors.success}
    >
      {successText}
    </Text>
  </div>
{/if}

