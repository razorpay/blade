<script lang="ts">
  import type { LinkOverlayProps } from './types';
  import { linkOverlayStyles } from '@razorpay/blade-core/styles';
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import { CARD_LINK_OVERLAY_ID } from './constants';

  let {
    href,
    target,
    rel,
    onClick,
    as = 'a',
    accessibilityLabel,
    isPressed = $bindable(false),
    onFocus,
    onBlur,
  }: LinkOverlayProps = $props();

  const elementType = as === 'button' ? 'button' : 'a';
  const classes = $derived(linkOverlayStyles({ as: elementType === 'button' ? 'button' : 'a' }));
  
  const metaAttrs = $derived(metaAttribute({ name: CARD_LINK_OVERLAY_ID }));
  const accessibilityAttrs = $derived(
    makeAccessible({ label: accessibilityLabel, pressed: href ? undefined : isPressed }),
  );

  function handleClick(event: MouseEvent): void {
    if (onClick) {
      onClick(event);
    }
  }

  function handleFocus(): void {
    if (onFocus) {
      onFocus();
    }
  }

  function handleBlur(): void {
    if (onBlur) {
      onBlur();
    }
  }
</script>

{#if elementType === 'a' && href}
  <a
    class={classes}
    {href}
    {target}
    {rel}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    {...metaAttrs}
    {...accessibilityAttrs}
  />
{:else if elementType === 'button'}
  <button
    type="button"
    class={classes}
    onclick={handleClick}
    onfocus={handleFocus}
    onblur={handleBlur}
    {...metaAttrs}
    {...accessibilityAttrs}
  />
{/if}
