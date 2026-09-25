<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCardGroupItemClasses,
    getCardGroupChevronClasses,
    getCardGroupTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { ChevronRightIcon } from '../Icons/ChevronRightIcon';
  import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
  import { getCollapsibleContext } from '../Collapsible/context';
  import { isInsideCardGroupBody } from './cardGroupContext';
  import type { CardGroupItemProps } from './types';

  const templateClasses = getCardGroupTemplateClasses();

  let {
    children: content,
    leading,
    trailing,
    href,
    target,
    rel,
    onClick,
    isSelected = false,
    isDisabled = false,
    accessibilityLabel,
    testID,
    ...rest
  }: CardGroupItemProps = $props();

  // A row acts as the disclosure trigger when it sits directly inside a
  // Collapsible (via CardGroupCollapsibleItem) but not inside that item's body.
  const collapsibleGetter = getCollapsibleContext();
  const insideBody = isInsideCardGroupBody();
  const isTrigger = Boolean(collapsibleGetter) && !insideBody;
  const collapsibleCtx = $derived(collapsibleGetter?.());

  const isNavigation = $derived(Boolean(href) && !isTrigger);
  const isInteractive = $derived(isTrigger || isNavigation || Boolean(onClick) || isSelected);
  const isExpanded = $derived(isTrigger ? Boolean(collapsibleCtx?.isExpanded) : false);

  // A link navigates; a trigger or selecting row is a button; everything else is
  // a plain container.
  const tag = $derived(
    isNavigation ? 'a' : isTrigger || Boolean(onClick) || isSelected ? 'button' : 'div',
  );

  const itemClass = $derived(getCardGroupItemClasses({ isInteractive, isSelected, isDisabled }));
  const chevronClass = $derived(getCardGroupChevronClasses({ isExpanded }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClass = $derived(
    [itemClass, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CardGroupItem, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    isTrigger
      ? makeAccessible({
          expanded: isExpanded,
          controls: collapsibleCtx?.collapsibleBodyId,
          label: accessibilityLabel,
        })
      : makeAccessible({ label: accessibilityLabel }),
  );

  function handleClick(event: MouseEvent): void {
    if (isDisabled) return;
    if (isTrigger) {
      collapsibleCtx?.onExpandChange(!collapsibleCtx.isExpanded);
      return;
    }
    onClick?.(event);
  }
</script>

<svelte:element
  this={tag}
  class={rootClass}
  href={isNavigation && !isDisabled ? href : undefined}
  target={isNavigation && !isDisabled ? target : undefined}
  rel={isNavigation && !isDisabled ? rel : undefined}
  aria-disabled={isDisabled ? 'true' : undefined}
  tabindex={isNavigation && isDisabled ? -1 : undefined}
  type={tag === 'button' ? 'button' : undefined}
  disabled={tag === 'button' && isDisabled ? true : undefined}
  aria-current={isSelected ? 'true' : undefined}
  onclick={handleClick}
  {...a11yAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {#if leading}
    <span class={templateClasses.cardGroupItemLeading}>{@render leading()}</span>
  {/if}

  <span class={templateClasses.cardGroupItemContent}>
    {#if typeof content === 'string'}
      {content}
    {:else if content}
      {@render content()}
    {/if}
  </span>

  {#if trailing}
    <span class={templateClasses.cardGroupItemTrailing}>{@render trailing()}</span>
  {/if}

  {#if isNavigation}
    <span class={templateClasses.cardGroupChevron}>
      <ChevronRightIcon size="medium" color="surface.icon.gray.subtle" />
    </span>
  {:else if isTrigger}
    <span class={chevronClass}>
      <ChevronDownIcon size="medium" color="surface.icon.gray.subtle" />
    </span>
  {/if}
</svelte:element>
