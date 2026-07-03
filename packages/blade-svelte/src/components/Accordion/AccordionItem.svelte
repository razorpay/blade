<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import Collapsible from '../Collapsible/Collapsible.svelte';
  import Divider from '../Divider/Divider.svelte';
  import { getAccordionContext, setAccordionItemContext } from './context';
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
  const isDefaultExpanded = $derived(accordionCtx.defaultExpandedIndex === itemIndex);
  const variant = $derived(accordionCtx.variant);
  const numberOfItems = $derived(accordionCtx.numberOfItems);
  const isLastItem = $derived(
    itemIndex !== undefined && itemIndex === numberOfItems - 1,
  );
  const showDivider = $derived(!isLastItem || variant === 'transparent');

  // Bridge Collapsible's boolean expand state onto the Accordion's index
  // protocol: expanding an item sets the accordion to this item's index,
  // collapsing resets it to -1 (no item expanded).
  const handleExpandChange = ({ isExpanded: nextIsExpanded }: { isExpanded: boolean }) => {
    if (isDisabled) return;
    accordionCtx.onExpandChange(nextIsExpanded ? itemIndex : -1);
  };

  setAccordionItemContext(() => ({
    index: itemIndex,
    isDisabled,
  }));

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AccordionItem, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div {...metaAttrs} {...analyticsAttrs}>
  <Collapsible
    {isExpanded}
    defaultIsExpanded={isDefaultExpanded}
    onExpandChange={handleExpandChange}
    _shouldApplyWidthRestrictions={false}
    _dangerouslyDisableValidations={true}
  >
    {@render children()}
  </Collapsible>
  {#if showDivider}
    <Divider />
  {/if}
</div>
