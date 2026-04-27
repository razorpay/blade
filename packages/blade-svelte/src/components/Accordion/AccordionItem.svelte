<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import Divider from '../Divider/Divider.svelte';
  import {
    getAccordionContext,
    setAccordionItemContext,
  } from './context';
  import type { AccordionItemProps } from './types';

  let {
    children,
    isDisabled = false,
    testID,
    ...rest
  }: AccordionItemProps = $props();

  const getAccCtx = getAccordionContext();
  const accordionCtx = $derived(getAccCtx());

  // Register once during initialization — runs in DOM order
  const itemIndex = getAccCtx().registerItem();

  const isExpanded = $derived(accordionCtx.expandedIndex === itemIndex);
  const variant = $derived(accordionCtx.variant);
  const numberOfItems = $derived(accordionCtx.numberOfItems);
  const isLastItem = $derived(
    itemIndex !== undefined && itemIndex === numberOfItems - 1,
  );
  const showDivider = $derived(!isLastItem || variant === 'transparent');

  const collapsibleBodyId = `accordion-body-${Math.random().toString(36).slice(2, 9)}`;

  const toggle = () => {
    if (isDisabled) return;
    if (isExpanded) {
      accordionCtx.onExpandChange(-1);
    } else {
      accordionCtx.onExpandChange(itemIndex);
    }
  };

  setAccordionItemContext(() => ({
    index: itemIndex,
    isDisabled,
    isExpanded,
    toggle,
    collapsibleBodyId,
  }));

  const metaAttrs = metaAttribute({ name: MetaConstants.AccordionItem, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
  {#if showDivider}
    <Divider />
  {/if}
</div>
