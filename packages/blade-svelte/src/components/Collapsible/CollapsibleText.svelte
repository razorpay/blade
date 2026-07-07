<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { getCollapsibleTextClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import CollapsibleChevronIcon from './CollapsibleChevronIcon.svelte';
  import { getCollapsibleContext } from './context';
  import type { CollapsibleTextProps } from './types';

  let {
    children,
    size = 'medium',
    weight = 'regular',
    color,
    isDisabled = false,
    testID,
    accessibilityLabel,
    ...rest
  }: CollapsibleTextProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleText must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());
  const isExpanded = $derived(ctx.isExpanded);

  const toggleIsExpanded = () => {
    if (!isDisabled) {
      ctx.onExpandChange(!isExpanded);
    }
  };

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet) : undefined);

  const triggerClass = $derived(getCollapsibleTextClasses());
  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClass = $derived(
    [triggerClass, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  const a11y = $derived(
    makeAccessible({
      label: accessibilityLabel,
      controls: ctx.collapsibleBodyId,
      expanded: isExpanded,
      disabled: isDisabled,
    }),
  );
  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CollapsibleText, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<button
  type="button"
  class={rootClass}
  disabled={isDisabled || undefined}
  onclick={toggleIsExpanded}
  {...a11y}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <Text as="span" {size} {weight} {color}>
    {#if isStringChildren}
      {children}
    {:else if snippetChildren}
      {@render snippetChildren()}
    {/if}
  </Text>
  <CollapsibleChevronIcon size="medium" color="currentColor" />
</button>
