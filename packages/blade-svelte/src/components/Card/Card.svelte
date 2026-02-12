<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import CardRoot from './CardRoot.svelte';
  import CardSurface from './CardSurface.svelte';
  import LinkOverlay from './LinkOverlay.svelte';
  import { setCardContext } from './CardContext';
  import type { CardProps } from './types';

  let {
    children: cardContent,
    backgroundColor = 'surface.background.gray.intense',
    borderRadius = 'medium',
    elevation = 'lowRaised',
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    isSelected = false,
    href,
    target,
    rel,
    accessibilityLabel,
    shouldScaleOnHover = false,
    onHover,
    size = 'large',
    onClick,
    as,
    cursor,
    validationState = 'none',
    testID,
    ...rest
  }: CardProps = $props();

  // Set context with getter for reactivity
  setCardContext(() => ({ size }));

  let isFocused = $state(false);

  const defaultRel = $derived(
    target && target === '_blank' ? 'noreferrer noopener' : undefined
  );

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  function handleLinkOverlayFocus(): void {
    isFocused = true;
  }

  function handleLinkOverlayBlur(): void {
    isFocused = false;
  }
</script>

<CardRoot
  {as}
  {borderRadius}
  {shouldScaleOnHover}
  {isSelected}
  {isFocused}
  {validationState}
  {accessibilityLabel}
  {onHover}
  {width}
  {height}
  {minHeight}
  {minWidth}
  {maxWidth}
  {cursor}
  {testID}
  {...rest}
  {...analyticsAttrs}
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
            {isSelected}
            onFocus={handleLinkOverlayFocus}
            onBlur={handleLinkOverlayBlur}
          />
        {:else if onClick}
          <LinkOverlay
            as="button"
            {onClick}
            {accessibilityLabel}
            {isSelected}
            onFocus={handleLinkOverlayFocus}
            onBlur={handleLinkOverlayBlur}
          />
        {/if}
        {@render cardContent()}
      {/snippet}
    </CardSurface>
  {/snippet}
</CardRoot>
