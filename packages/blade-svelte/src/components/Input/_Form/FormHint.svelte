<script lang="ts">
  import {
    getFormHintClasses,
    getFormTemplateClasses,
    hintTextSize,
    hintIconSize,
    hintTextColor,
  } from '@razorpay/blade-core/styles';
  import Text from '../../Typography/Text/Text.svelte';
  import type { TextColors } from '../../Typography/BaseText/types';
  import { InfoIcon, CheckIcon } from '../../Icons';
  import type { FormHintProps } from './types';

  const templateClasses = getFormTemplateClasses();

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

  const showError = $derived(type === 'error' && Boolean(errorText));
  const showSuccess = $derived(type === 'success' && Boolean(successText));
  const showHelp = $derived(!showError && !showSuccess && Boolean(helpText));

  const hintClasses = $derived(getFormHintClasses({ size }));
  const textSize = $derived(hintTextSize[size]);
  const iconSize = $derived(hintIconSize[size]);
  const textMarginTop = $derived(size === 'large' ? 'spacing.1' : 'spacing.0');
  const helpColor = $derived(hintTextColor.help as TextColors);
  const errorColor = $derived(hintTextColor.error as TextColors);
  const successColor = $derived(hintTextColor.success as TextColors);
</script>

{#if showHelp}
  <div class={hintClasses} id={helpTextId}>
    <span class={templateClasses.hintWrapper}>
      <Text as="span" variant="caption" size={textSize} color={helpColor} wordBreak="break-word">
        {helpText}
      </Text>
    </span>
  </div>
{/if}

{#if showError}
  <div class={hintClasses} id={errorTextId}>
    <span class={templateClasses.hintWrapper}>
      <span class={templateClasses.hintIcon}>
        <InfoIcon size={iconSize} color="feedback.icon.negative.intense" />
      </span>
      <Text
        as="span"
        variant="caption"
        size={textSize}
        color={errorColor}
        wordBreak="break-word"
        marginTop={textMarginTop}
      >
        {errorText}
      </Text>
    </span>
  </div>
{/if}

{#if showSuccess}
  <div class={hintClasses} id={successTextId}>
    <span class={templateClasses.hintWrapper}>
      <span class={templateClasses.hintIcon}>
        <CheckIcon size={iconSize} color="feedback.icon.positive.intense" />
      </span>
      <Text
        as="span"
        variant="caption"
        size={textSize}
        color={successColor}
        wordBreak="break-word"
        marginTop={textMarginTop}
      >
        {successText}
      </Text>
    </span>
  </div>
{/if}
