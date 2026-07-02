<script module lang="ts">
  import type { IconColor, IconSize } from '../../Icons/types';
  import type { TextColors } from '../../Typography/BaseText/types';
  import type { BaseInputSize, BaseInputValidationState } from './types';

  const iconSizeMap: Record<BaseInputSize, IconSize> = {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'large',
  };

  const textSizeMap = {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'large',
  } as const;

  const validationTextSizeMap = {
    xsmall: 'xsmall',
    small: 'small',
    medium: 'small',
    large: 'medium',
  } as const;

  const trailingIconColorMap: Record<BaseInputValidationState, IconColor> = {
    none: 'surface.icon.gray.subtle',
    error: 'feedback.icon.negative.intense',
    success: 'feedback.icon.positive.intense',
  };

  const validationTextColorMap: Record<BaseInputValidationState, TextColors> = {
    none: 'surface.text.gray.subtle',
    error: 'feedback.text.negative.intense',
    success: 'feedback.text.positive.intense',
  };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getBaseInputTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../../Typography/Text/Text.svelte';
  import Tooltip from '../../Tooltip/Tooltip.svelte';
  import type { IconComponent } from '../../Icons/iconMap';

  const templateClasses = getBaseInputTemplateClasses();

  type BaseInputVisualsProps = {
    /** Which side these visuals render on. */
    visualType: 'leading' | 'trailing';
    size: BaseInputSize;
    isDisabled?: boolean;
    validationState?: BaseInputValidationState;
    // leading
    leadingIcon?: IconComponent;
    prefix?: string;
    leadingInteractionElement?: Snippet;
    // trailing
    trailingInteractionElement?: Snippet;
    onTrailingInteractionElementClick?: () => void;
    suffix?: string;
    trailingIcon?: IconComponent;
    trailingButton?: Snippet;
    showHintsAsTooltip?: boolean;
    errorText?: string;
    successText?: string;
    validationTextPlacement?: 'outside' | 'inside';
    errorTextId?: string;
    successTextId?: string;
  };

  let {
    visualType,
    size,
    isDisabled = false,
    validationState = 'none',
    leadingIcon: LeadingIcon,
    prefix,
    leadingInteractionElement,
    trailingInteractionElement,
    onTrailingInteractionElementClick,
    suffix,
    trailingIcon: TrailingIcon,
    trailingButton,
    showHintsAsTooltip = false,
    errorText,
    successText,
    validationTextPlacement,
    errorTextId,
    successTextId,
  }: BaseInputVisualsProps = $props();

  const hasLeadingIcon = $derived(Boolean(LeadingIcon));
  const hasPrefix = $derived(Boolean(prefix));
  const hasLeadingInteractionElement = $derived(Boolean(leadingInteractionElement));
  const hasTrailingInteractionElement = $derived(Boolean(trailingInteractionElement));
  const hasSuffix = $derived(Boolean(suffix));
  const hasTrailingIcon = $derived(Boolean(TrailingIcon));
  const hasTrailingButton = $derived(Boolean(trailingButton));

  const insideValidationText = $derived(
    validationTextPlacement === 'inside' && validationState !== 'none'
      ? validationState === 'error'
        ? errorText
        : successText
      : undefined,
  );
  const hasInsideValidationText = $derived(Boolean(insideValidationText));

  const hasLeadingVisuals = $derived(
    hasLeadingInteractionElement || hasLeadingIcon || hasPrefix,
  );
  const hasTrailingVisuals = $derived(
    hasTrailingInteractionElement ||
      hasSuffix ||
      hasTrailingIcon ||
      hasTrailingButton ||
      hasInsideValidationText,
  );

  const iconSize = $derived(iconSizeMap[size]);
  const textSize = $derived(textSizeMap[size]);
  const validationTextSize = $derived(validationTextSizeMap[size]);

  // Prefix left padding: with icon -> spacing.3, without -> spacing.4
  const prefixClasses = $derived(
    [
      templateClasses.prefix,
      hasLeadingIcon ? templateClasses.prefixWithIcon : templateClasses.prefixNoIcon,
    ]
      .filter(Boolean)
      .join(' '),
  );

  // Trailing interaction padding: alone -> spacing.4, with suffix/icon/button -> spacing.2
  const trailingInteractionClasses = $derived(
    [
      templateClasses.trailingInteraction,
      hasSuffix || hasTrailingIcon || hasTrailingButton
        ? templateClasses.trailingInteractionCombo
        : templateClasses.trailingInteractionSolo,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const suffixClasses = $derived(
    [
      templateClasses.suffix,
      hasTrailingIcon || hasTrailingButton
        ? templateClasses.suffixWithTrailing
        : templateClasses.suffixNoTrailing,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const trailingIconClasses = $derived(
    [
      templateClasses.trailingIcon,
      hasTrailingButton
        ? templateClasses.trailingIconWithButton
        : templateClasses.trailingIconNoButton,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const insideValidationClasses = $derived(
    [
      templateClasses.insideValidation,
      size === 'xsmall' || size === 'small'
        ? templateClasses.insideValidationSm
        : templateClasses.insideValidationLg,
    ]
      .filter(Boolean)
      .join(' '),
  );

  const showValidationTooltip = $derived(
    (showHintsAsTooltip && validationState === 'error' && Boolean(errorText)) ||
      (showHintsAsTooltip && validationState === 'success' && Boolean(successText)),
  );
  const tooltipContent = $derived(
    validationState === 'error'
      ? errorText ?? ''
      : validationState === 'success'
        ? successText ?? ''
        : '',
  );

  const iconColor = $derived<IconColor>(
    isDisabled ? 'interactive.icon.gray.disabled' : trailingIconColorMap[validationState],
  );
</script>

{#if visualType === 'leading' && hasLeadingVisuals}
  <div class={templateClasses.visuals}>
    {#if hasLeadingInteractionElement}
      <div
        class={[templateClasses.leadingInteraction, templateClasses.leadingInteractionPad].join(' ')}
      >
        {@render leadingInteractionElement?.()}
      </div>
    {/if}
    {#if LeadingIcon}
      <div class={templateClasses.leadingIcon}>
        <LeadingIcon
          size={iconSize}
          color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
        />
      </div>
    {/if}
    {#if hasPrefix}
      <div class={prefixClasses}>
        <Text
          as="span"
          size={textSize}
          variant="body"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
        >
          {prefix}
        </Text>
      </div>
    {/if}
  </div>
{/if}

{#if visualType === 'trailing' && hasTrailingVisuals}
  <div class={templateClasses.visuals}>
    {#if hasTrailingInteractionElement}
      <div class={templateClasses.visuals}>
        <div
          class={trailingInteractionClasses}
          role="presentation"
          onclick={() => onTrailingInteractionElementClick?.()}
        >
          {@render trailingInteractionElement?.()}
        </div>
      </div>
    {/if}
    {#if hasSuffix}
      <div class={suffixClasses}>
        <Text
          as="span"
          size={textSize}
          variant="body"
          weight="regular"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.subtle'}
        >
          {suffix}
        </Text>
      </div>
    {/if}
    {#if hasInsideValidationText}
      <div
        class={insideValidationClasses}
        id={validationState === 'error' ? errorTextId : successTextId}
      >
        <Text
          as="span"
          size={validationTextSize}
          variant="body"
          weight="medium"
          color={validationTextColorMap[validationState]}
        >
          {insideValidationText}
        </Text>
      </div>
    {/if}
    {#if TrailingIcon}
      <div class={trailingIconClasses}>
        {#if showValidationTooltip}
          <Tooltip content={tooltipContent}>
            <div class={templateClasses.trailingIcon}>
              <TrailingIcon size={iconSize} color={iconColor} />
            </div>
          </Tooltip>
        {:else}
          <TrailingIcon size={iconSize} color={iconColor} />
        {/if}
      </div>
    {/if}
    {#if trailingButton}
      <div class={templateClasses.trailingButton}>
        {@render trailingButton()}
      </div>
    {/if}
  </div>
{/if}
