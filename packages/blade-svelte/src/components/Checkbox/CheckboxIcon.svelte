<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import {
    getCheckboxIconClasses,
    getCheckboxIconVariant,
    getCheckboxSvgClasses,
    getCheckboxTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import type { CheckboxIconProps } from './types';

  const templateClasses = getCheckboxTemplateClasses();

  let {
    isChecked = false,
    isIndeterminate = false,
    isDisabled = false,
    isNegative = false,
    size = 'medium',
  }: CheckboxIconProps = $props();

  // The box appears "checked" (filled) when checked OR indeterminate.
  const boxChecked = $derived(Boolean(isChecked || isIndeterminate));
  const variant = $derived(getCheckboxIconVariant(isDisabled, isNegative));

  const iconClasses = $derived(
    getCheckboxIconClasses({ size, variant, isChecked: boxChecked, isIndeterminate }),
  );
  const svgClasses = $derived(getCheckboxSvgClasses({ size, isDisabled }));

  const showDash = $derived(Boolean(isIndeterminate));
  const showTick = $derived(Boolean(isChecked) && !isIndeterminate);

  // Mirror React's Fade: `show === undefined` on first mount → no animation
  // (prevents a flash of animation). After mount, animate enter/exit.
  let mounted = $state(false);
  $effect(() => {
    mounted = true;
  });

  function fadeClasses(show: boolean): string {
    return [
      templateClasses.fade,
      show ? templateClasses.fadeShown : '',
      mounted ? (show ? templateClasses.fadeIn : templateClasses.fadeOut) : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  const wrapperMeta = metaAttribute({ name: 'checkbox-icon-wrapper' });
  const fadeMeta = metaAttribute({ name: 'checkbox-icon-fade' });
</script>

<div class={iconClasses} {...wrapperMeta}>
  <div class={fadeClasses(showDash)} {...fadeMeta}>
    <svg
      class={svgClasses}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.3335 3.99984C1.3335 3.81574 1.48273 3.6665 1.66683 3.6665H6.3335C6.51759 3.6665 6.66683 3.81574 6.66683 3.99984C6.66683 4.18393 6.51759 4.33317 6.3335 4.33317H1.66683C1.48273 4.33317 1.3335 4.18393 1.3335 3.99984Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
  <div class={fadeClasses(showTick)} {...fadeMeta}>
    <svg
      class={svgClasses}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.90237 1.76413C7.03254 1.89431 7.03254 2.10536 6.90237 2.23554L3.2357 5.90221C3.10553 6.03238 2.89447 6.03238 2.7643 5.90221L1.09763 4.23554C0.967456 4.10536 0.967456 3.89431 1.09763 3.76414C1.22781 3.63396 1.43886 3.63396 1.56904 3.76414L3 5.1951L6.43096 1.76413C6.56114 1.63396 6.77219 1.63396 6.90237 1.76413Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</div>
