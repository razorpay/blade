<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import CardRoot from './CardRoot.svelte';
  import CardTicketSurface from './CardTicketSurface.svelte';
  import CardBody from './CardBody.svelte';
  import LinkOverlay from './LinkOverlay.svelte';
  import { setCardContext } from './CardContext';
  import type { TicketCardProps } from './types';

  let {
    topSection,
    bottomSection,
    borderRadius = 'medium',
    elevation: _deprecatedElevation,
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
    testID,
    ...rest
  }: TicketCardProps = $props();

  setCardContext(() => ({ size }));

  let isFocused = $state(false);

  const isCardSelected = $derived(isSelected && !isDisabled);

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

{#snippet topSectionWithBody()}
  <CardBody>{@render topSection()}</CardBody>
{/snippet}

{#snippet bottomSectionWithBody()}
  <CardBody>{@render bottomSection()}</CardBody>
{/snippet}

<CardRoot
  {as}
  {borderRadius}
  isSelected={false}
  {isFocused}
  {isDisabled}
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
  <CardTicketSurface
    topSection={topSectionWithBody}
    bottomSection={bottomSectionWithBody}
    isSelected={isCardSelected}
    {isDisabled}
    children={linkOverlay}
  />
</CardRoot>
