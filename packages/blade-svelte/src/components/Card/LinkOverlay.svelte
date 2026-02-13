<script lang="ts">
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import { CARD_LINK_OVERLAY_ID } from './constants';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  let {
    as = 'a',
    href,
    target,
    rel,
    onClick,
    accessibilityLabel,
    isSelected = false,
    onFocus,
    onBlur,
  }: {
    as?: 'a' | 'button';
    href?: string;
    target?: string;
    rel?: string;
    onClick?: (event: MouseEvent) => void;
    accessibilityLabel?: string;
    isSelected?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
  } = $props();

  const metaAttrs = $derived(metaAttribute({ name: CARD_LINK_OVERLAY_ID }));
  const a11yAttrs = $derived(
    makeAccessible({
      label: accessibilityLabel,
      pressed: href ? undefined : isSelected,
    })
  );

  function handleClick(event: MouseEvent): void {
    onClick?.(event);
  }

  function handleFocus(): void {
    onFocus?.();
  }

  function handleBlur(): void {
    onBlur?.();
  }
</script>

{#if as === 'button'}
  <button
    class={templateClasses.linkOverlay}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    {...metaAttrs}
    {...a11yAttrs}
  ></button>
{:else}
  <a
    class={templateClasses.linkOverlay}
    {href}
    {target}
    {rel}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    {...metaAttrs}
    {...a11yAttrs}
  ></a>
{/if}
