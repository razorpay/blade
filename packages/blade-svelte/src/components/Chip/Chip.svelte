<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getAnimatedChipClasses,
    getChipInnerClasses,
    getChipTemplateClasses,
    getChipColorVariant,
    getChipTextColorToken,
    getChipIconColorToken,
    getChipTextSizes,
    getChipIconSizes,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import { getChipGroupContext } from './chipContext';
  import type { ChipProps } from './types';

  const templateClasses = getChipTemplateClasses();
  const textSizes = getChipTextSizes();
  const iconSizes = getChipIconSizes();

  let {
    children,
    icon: Icon,
    color,
    isDisabled = false,
    value,
    width,
    maxWidth,
    minWidth,
    testID,
    ...rest
  }: ChipProps = $props();

  const groupCtx = getChipGroupContext();

  const _isDisabled = $derived(isDisabled || groupCtx?.isDisabled || false);
  const _isRequired = $derived(
    groupCtx?.isRequired || groupCtx?.necessityIndicator === 'required',
  );
  const _name = $derived(groupCtx?.name);
  const _size = $derived(groupCtx?.size || 'small');
  const chipColor = $derived(color ?? groupCtx?.color ?? 'primary');
  const selectionType = $derived(groupCtx?.selectionType || 'single');
  const inputType = $derived(selectionType === 'single' ? 'radio' : 'checkbox');
  const _isChecked = $derived(groupCtx?.state?.isChecked(value!) || false);
  const hasError = $derived(groupCtx?.validationState === 'error');

  let isPressed = $state(false);

  function handleChange() {
    if (_isDisabled || !value) return;
    if (_isChecked) {
      groupCtx?.state?.removeValue(value);
    } else {
      groupCtx?.state?.addValue(value);
    }
  }

  function handlePointerDown() {
    if (!_isDisabled) isPressed = true;
  }

  function handlePointerUp() {
    if (!_isDisabled) isPressed = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!_isDisabled && e.key === ' ') isPressed = true;
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (!_isDisabled && e.key === ' ') isPressed = false;
  }

  const colorVariant = $derived(getChipColorVariant(_isChecked, chipColor, _isDisabled));
  const outerClasses = $derived(
    getAnimatedChipClasses({ size: _size, colorVariant }),
  );
  const innerClasses = $derived(
    getChipInnerClasses({ size: _size, colorVariant, isDisabled: _isDisabled }),
  );
  const styledProps = $derived(getStyledPropsClasses(rest));
  const animatedChipClasses = $derived(
    [outerClasses, isPressed ? templateClasses.pressed : '', ...(styledProps.classes || [])]
      .filter(Boolean)
      .join(' '),
  );

  const textColorToken = $derived(
    getChipTextColorToken(_isChecked, chipColor, _isDisabled) as TextColors,
  );
  const iconColorToken = $derived(
    getChipIconColorToken(_isChecked, chipColor, _isDisabled) as IconColor,
  );
  const fontSize = $derived(textSizes.fontSize[_size]);
  const lineHeight = $derived(textSizes.lineHeight[_size]);
  const letterSpacing = $derived(textSizes.letterSpacing[_size]);
  const iconSize = $derived(iconSizes[_size]);

  const metaAttrs = metaAttribute({ name: MetaConstants.Chip, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      ...(hasError ? { invalid: true } : {}),
    }),
  );

  const wrapperStyle = $derived(
    [
      width ? `width:${width}` : '',
      maxWidth ? `max-width:${maxWidth}` : '',
      minWidth ? `min-width:${minWidth}` : '',
    ]
      .filter(Boolean)
      .join(';') || undefined,
  );
</script>

<div
  class={templateClasses.chipWrapper}
  style={wrapperStyle}
  {...metaAttrs}
  {...a11yAttrs}
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <label
    class={_isDisabled ? templateClasses.labelDisabled : templateClasses.label}
    {...metaAttribute({ name: MetaConstants.ChipLabel })}
    onmousedown={handlePointerDown}
    onmouseup={handlePointerUp}
    onmouseout={handlePointerUp}
    ontouchstart={handlePointerDown}
    ontouchend={handlePointerUp}
    onkeydown={handleKeyDown}
    onkeyup={handleKeyUp}
  >
    <input
      class={templateClasses.srOnly}
      type={inputType}
      name={_name}
      {value}
      checked={_isChecked}
      disabled={_isDisabled || undefined}
      required={_isRequired || undefined}
      onchange={handleChange}
      {...analyticsAttrs}
    />
    <div class={animatedChipClasses}>
      <div class={innerClasses}>
        {#if Icon}
          <span class={templateClasses.chipIcon}>
            <Icon size={iconSize} color={iconColorToken} />
          </span>
        {/if}
        {#if children}
          <span class={templateClasses.chipText}>
            <BaseText
              as="span"
              color={textColorToken}
              {fontSize}
              {lineHeight}
              {letterSpacing}
              fontFamily="text"
              fontWeight="regular"
              truncateAfterLines={1}
            >
              {@render children()}
            </BaseText>
          </span>
        {/if}
      </div>
    </div>
  </label>
</div>
