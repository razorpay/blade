<script lang="ts">
  import type { Snippet } from 'svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import CardRoot from './CardRoot.svelte';
  import CardTicketSurface from './CardTicketSurface.svelte';
  import CardBody from './CardBody.svelte';
  import LinkOverlay from './LinkOverlay.svelte';
  import { setCardContext } from './CardContext';
  import {
    TICKET_CARD_CONTEXT_KEY,
    setSectionedCardContext,
  } from './sectionedCardContext';
  import type { TicketCardProps } from './types';

  let {
    children,
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

  let bodySnippet = $state<Snippet | undefined>();
  let footerSnippet = $state<Snippet | undefined>();

  setCardContext(() => ({ size }));
  setSectionedCardContext(TICKET_CARD_CONTEXT_KEY, {
    setBody: (content) => {
      bodySnippet = content;
    },
    setFooter: (content) => {
      footerSnippet = content;
    },
  });

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
  {@render children()}

  {#if bodySnippet && footerSnippet}
    <CardTicketSurface
      topSection={bodyRegion}
      bottomSection={footerRegion}
      isSelected={isCardSelected}
      {isDisabled}
      children={linkOverlay}
    />
  {/if}
</CardRoot>

{#snippet bodyRegion()}
  <CardBody>
    {#if bodySnippet}
      {@render bodySnippet()}
    {/if}
  </CardBody>
{/snippet}

{#snippet footerRegion()}
  <CardBody>
    {#if footerSnippet}
      {@render footerSnippet()}
    {/if}
  </CardBody>
{/snippet}
