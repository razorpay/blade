<script lang="ts">
  import { makeAccessible, metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import type { BaseSpinnerProps } from './types';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import {
    getSpinnerClasses,
    spinnerBoxClass,
    spinnerIconClass,
    type SpinnerSize,
  } from '@razorpay/blade-core/styles';
  import { utilityClasses } from '@razorpay/blade-core/styles';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';

  let {
    size = 'medium',
    color = 'neutral',
    accessibilityLabel,
    label,
    labelPosition = 'right',
    testID,
    ...rest
  }: BaseSpinnerProps = $props();

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Generate spinner classes from blade-core
  const spinnerClasses = $derived(
    getSpinnerClasses({
      size,
      color,
    }),
  );

  // Combine classes
  const combinedClasses = $derived(() => {
    const classes = [spinnerClasses];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Accessibility attributes
  const accessibilityAttrs = $derived(
    makeAccessible({
      role: 'progressbar',
      label: accessibilityLabel,
    }),
  );

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Spinner,
    testID,
  });

  // Spinner dimensions based on size
  const dimensions = $derived.by(() => {
    const sizeMap: Record<SpinnerSize, number> = {
      medium: 16,
      large: 20,
      xlarge: 24,
    };
    return sizeMap[size];
  });

  // Container classes for label positioning
  const containerClasses = $derived(() => {
    const baseClasses = [utilityClasses['display-flex'], utilityClasses['items-center']];
    if (labelPosition === 'bottom') {
      baseClasses.push(utilityClasses['flex-direction-column']);
    }
    return baseClasses.join(' ');
  });

  // Label margin classes
  const labelMarginClasses = $derived(() => {
    if (labelPosition === 'right') {
      return utilityClasses['margin-left-spacing-3'];
    }
    return utilityClasses['margin-top-spacing-3'];
  });
</script>

<div class={combinedClasses()} {...metaAttrs}>
  <div class={containerClasses()} {...accessibilityAttrs}>
    <div class={spinnerBoxClass}>
      <svg
        class={spinnerIconClass}
        width={dimensions}
        height={dimensions}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-opacity="0.2"
          d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z"
          fill="currentColor"
        />
        <path
          d="M24 12C24 13.8937 23.5518 15.7606 22.6921 17.4479C21.8324 19.1352 20.5855 20.5951 19.0534 21.7082C17.5214 22.8213 15.7476 23.556 13.8772 23.8523C12.0068 24.1485 10.0928 23.9979 8.29181 23.4127L9.21886 20.5595C10.5696 20.9984 12.0051 21.1114 13.4079 20.8892C14.8107 20.667 16.141 20.116 17.2901 19.2812C18.4391 18.4463 19.3743 17.3514 20.0191 16.0859C20.6639 14.8204 21 13.4203 21 12H24Z"
          fill="currentColor"
        />
        <path
          d="M-1.33514e-05 12C-1.33514e-05 10.1063 0.448176 8.23944 1.30791 6.55211C2.16764 4.86479 3.41451 3.4049 4.94656 2.2918C6.47862 1.17869 8.25236 0.443983 10.1228 0.147739C11.9932 -0.148504 13.9072 0.00212896 15.7082 0.587322L14.7811 3.44049C13.4304 3.0016 11.9949 2.88862 10.5921 3.11081C9.18927 3.33299 7.85896 3.88402 6.70992 4.71885C5.56088 5.55367 4.62573 6.64859 3.98093 7.91409C3.33613 9.17958 2.99999 10.5797 2.99999 12H-1.33514e-05Z"
          fill="currentColor"
        />
      </svg>
    </div>
    {#if typeof label === 'string' && label.trim().length > 0}
      <div class={labelMarginClasses()}>
        <BaseText
          as="span"
          fontSize={75}
          lineHeight={75}
          fontFamily="text"
          fontWeight="regular"
          color="surface.text.gray.muted"
          componentName={MetaConstants.Spinner}
        >
          {label}
        </BaseText>
      </div>
    {/if}
  </div>
</div>

