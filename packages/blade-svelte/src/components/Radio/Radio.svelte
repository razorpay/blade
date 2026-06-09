<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getRadioIconWrapperClasses,
    getRadioDotClasses,
    getRadioTitleClasses,
    getRadioHelpTextClasses,
    getRadioTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { getRadioGroupContext } from './radioContext';
  import type { RadioProps } from './types';

  const templateClasses = getRadioTemplateClasses();

  let {
    value,
    children,
    helpText,
    isDisabled = false,
    size = 'medium',
    testID,
    ...rest
  }: RadioProps = $props();

  const groupCtx = getRadioGroupContext();

  const _isDisabled = $derived(isDisabled || groupCtx?.isDisabled || false);
  const _isRequired = $derived(
    groupCtx?.isRequired || groupCtx?.necessityIndicator === 'required',
  );
  const _name = $derived(groupCtx?.name);
  const _size = $derived(groupCtx?.size ?? size);
  const hasError = $derived(groupCtx?.validationState === 'error');
  const isChecked = $derived(groupCtx?.state?.isChecked(value) ?? false);

  function handleChange(event: Event): void {
    if (_isDisabled) return;
    groupCtx?.state?.setValue(value, event);
  }

  const iconWrapperClasses = $derived(
    getRadioIconWrapperClasses({
      size: _size,
      isChecked,
      isDisabled: _isDisabled,
      isNegative: hasError,
    }),
  );

  const dotClasses = $derived(getRadioDotClasses(isChecked));

  const titleClasses = $derived(getRadioTitleClasses({ size: _size, isDisabled: _isDisabled }));

  const helpTextClasses = $derived(getRadioHelpTextClasses(_size));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const wrapperClasses = $derived(
    [templateClasses.radio, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Radio, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Dot SVG dimensions (matches radioSizes.icon from radioTokens.ts)
  const dotDimensions = $derived.by(() => {
    const map = {
      small: { width: 12, height: 12, radius: 2 },
      medium: { width: 16, height: 16, radius: 3 },
      large: { width: 20, height: 20, radius: 4 },
    };
    return map[_size];
  });

</script>

<div class={wrapperClasses} {...metaAttrs} {...analyticsAttrs}>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <label class={templateClasses.label} data-disabled={_isDisabled || undefined}>
    <input
      class={templateClasses.input}
      type="radio"
      name={_name}
      {value}
      checked={isChecked}
      disabled={_isDisabled || undefined}
      required={_isRequired || undefined}
      aria-invalid={hasError || undefined}
      onchange={handleChange}
    />
    <div class={templateClasses.row}>
      <!-- Radio icon wrapper -->
      <div class={iconWrapperClasses} data-disabled={_isDisabled || undefined}>
        <!-- Checked dot -->
        <span class={dotClasses} aria-hidden="true">
          <svg
            width="{dotDimensions.width}px"
            height="{dotDimensions.height}px"
            viewBox="0 0 {dotDimensions.width} {dotDimensions.height}"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="{dotDimensions.width / 2}"
              cy="{dotDimensions.height / 2}"
              r="{dotDimensions.radius}"
              fill="var(--interactive-icon-on-primary-normal)"
            />
          </svg>
        </span>
      </div>
      <!-- Label text -->
      {#if children}
        <span class={titleClasses}>
          {@render children()}
        </span>
      {/if}
    </div>
    <!-- Help text -->
    {#if helpText}
      <span class={helpTextClasses}>
        {helpText}
      </span>
    {/if}
  </label>
</div>
