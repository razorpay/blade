<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import CardRoot from './CardRoot.svelte';
  import CardSurface from './CardSurface.svelte';
  import LinkOverlay from './LinkOverlay.svelte';
  import { setCardContext } from './CardContext';
  import type { CardProps } from './types';

  let {
    children: cardContent,
    variant = 'primary',
    backgroundColor,
    borderRadius = 'medium',
    /* `elevation` is deprecated and a no-op (matches React). Kept in the
       destructure so it's swallowed rather than forwarded onto the DOM
       via {...rest} — the surface elevation is baked into .cardSurface. */
    elevation: _deprecatedElevation,
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    isSelected = false,
    isDisabled = false,
    href,
    target,
    rel,
    accessibilityLabel,
    onHover,
    size = 'large',
    onClick,
    as,
    cursor,
    overflow,
    overflowX,
    overflowY,
    validationState = 'none',
    testID,
    ...rest
  }: CardProps = $props();

  setCardContext(() => ({ size }));

  let isFocused = $state(false);

  const isCardSelected = $derived(isSelected && !isDisabled);

  const surfaceType = $derived(
    variant === 'secondary' || variant === 'theme' ? variant : 'primary'
  );

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

{#snippet linkOverlay()}
  {#if href && !isDisabled}
    <LinkOverlay
      {onClick}
      {href}
      {target}
      rel={rel ?? defaultRel}
      {accessibilityLabel}
      isSelected={isCardSelected}
      onFocus={handleLinkOverlayFocus}
      onBlur={handleLinkOverlayBlur}
    />
  {:else if onClick && !isDisabled}
    <LinkOverlay
      as="button"
      {onClick}
      {accessibilityLabel}
      isSelected={isCardSelected}
      onFocus={handleLinkOverlayFocus}
      onBlur={handleLinkOverlayBlur}
    />
  {/if}
{/snippet}

<CardRoot
  {as}
  {borderRadius}
  isSelected={isCardSelected}
  {isFocused}
  {isDisabled}
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
  <CardSurface
    type={surfaceType}
    {height}
    {minHeight}
    {padding}
    {borderRadius}
    {backgroundColor}
    {overflow}
    {overflowX}
    {overflowY}
  >
    {@render linkOverlay()}
    {#if cardContent}
      {@render cardContent()}
    {/if}
  </CardSurface>
</CardRoot>
