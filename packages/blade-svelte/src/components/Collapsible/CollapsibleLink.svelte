<script lang="ts">
  import Link from '../Link/Link.svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getCollapsibleContext } from './context';
  import CollapsibleChevronIcon from './CollapsibleChevronIcon.svelte';
  import type { CollapsibleLinkProps } from './types';

  let {
    children,
    size,
    color = 'primary',
    isDisabled,
    testID,
    accessibilityLabel,
    ...rest
  }: CollapsibleLinkProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleLink must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());
  const isExpanded = $derived(ctx.isExpanded);

  const toggleIsExpanded = () => {
    ctx.onExpandChange(!isExpanded);
  };

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<Link
  variant="button"
  {size}
  {color}
  icon={CollapsibleChevronIcon}
  iconPosition="right"
  {isDisabled}
  {testID}
  {accessibilityLabel}
  aria-controls={ctx.collapsibleBodyId}
  aria-expanded={isExpanded}
  onClick={toggleIsExpanded}
  {...analyticsAttrs}
>
  {#if typeof children === 'string'}
    {children}
  {:else if children}
    {@render children()}
  {/if}
</Link>
