<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import {
    getRadioIconWrapperClasses,
    getRadioIconVariant,
    getRadioTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { RadioSize } from './types';

  const templateClasses = getRadioTemplateClasses();

  let {
    size = 'medium',
    isChecked = false,
    isDisabled = false,
    isNegative = false,
  }: {
    size?: RadioSize;
    isChecked?: boolean;
    isDisabled?: boolean;
    isNegative?: boolean;
  } = $props();

  const dimensions: Record<RadioSize, { box: number; dotRadius: number }> = {
    small: { box: 12, dotRadius: 2 },
    medium: { box: 16, dotRadius: 3 },
    large: { box: 20, dotRadius: 4 },
  };

  const dim = $derived(dimensions[size]);
  const center = $derived(dim.box / 2);

  const variant = $derived(getRadioIconVariant(isDisabled, isNegative));
  const wrapperClasses = $derived(getRadioIconWrapperClasses({ size, variant, isChecked }));
  const dotClasses = $derived(
    [templateClasses.dot, isChecked ? templateClasses.dotChecked : ''].filter(Boolean).join(' '),
  );

  const iconMetaAttrs = metaAttribute({ name: 'radio-icon-wrapper' });
</script>

<div class={wrapperClasses} data-disabled={isDisabled || undefined} {...iconMetaAttrs}>
  <span class={dotClasses}>
    <svg
      width={dim.box}
      height={dim.box}
      viewBox={`0 0 ${dim.box} ${dim.box}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle class={templateClasses.dotCircle} cx={center} cy={center} r={dim.dotRadius} />
    </svg>
  </span>
</div>
