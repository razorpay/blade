<script lang="ts">
  import type { CardProps } from './types';
  import { setCardContext } from './CardContext';
  import CardRoot from './CardRoot.svelte';
  import CardSurface from './CardSurface.svelte';
  import LinkOverlay from './LinkOverlay.svelte';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';

  let {
    children,
    backgroundColor = 'surface.background.gray.intense',
    borderRadius = 'medium',
    elevation = 'lowRaised',
    testID,
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    onClick,
    isSelected = false,
    accessibilityLabel,
    shouldScaleOnHover = false,
    onHover,
    href,
    target,
    rel,
    as,
    size = 'large',
    cursor,
    ...rest
  }: CardProps = $props();

  let isFocused = $state(false);
  let isPressedState = $state(false);

  // Set context for child components
  setCardContext({ size });

  const styledPropsClasses = $derived(getStyledPropsClasses(rest));
  const analyticsAttributes = $derived(makeAnalyticsAttribute(rest));
  const defaultRel = $derived(target && target === '_blank' ? 'noreferrer noopener' : undefined);

  function handleMouseEnter(): void {
    if (onHover) {
      onHover();
    }
  }

  function handleFocus(): void {
    isFocused = true;
  }

  function handleBlur(): void {
    isFocused = false;
  }
</script>

<CardRoot
  {as}
  {borderRadius}
  {shouldScaleOnHover}
  {isSelected}
  {isFocused}
  {width}
  {height}
  {minHeight}
  {minWidth}
  {maxWidth}
  {accessibilityLabel}
  validationState="none"
  {cursor}
  {testID}
  {styledPropsClasses}
  {analyticsAttributes}
  onmouseenter={handleMouseEnter}
>
  {#snippet children()}
    <CardSurface
      {height}
      {minHeight}
      {padding}
      {borderRadius}
      {elevation}
      {backgroundColor}
    >
      {#snippet children()}
        {#if href}
          <LinkOverlay
            {onClick}
            {href}
            {target}
            rel={rel ?? defaultRel}
            {accessibilityLabel}
            bind:isPressed={isPressedState}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        {:else if onClick}
          <LinkOverlay
            as="button"
            {onClick}
            {accessibilityLabel}
            bind:isPressed={isPressedState}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        {/if}
        {@render children()}
      {/snippet}
    </CardSurface>
  {/snippet}
</CardRoot>
