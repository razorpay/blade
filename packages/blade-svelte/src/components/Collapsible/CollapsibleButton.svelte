<script lang="ts">
  import Button from '../Button/Button.svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getCollapsibleContext } from './context';
  import type { CollapsibleButtonProps } from './types';

  let {
    children,
    variant,
    size,
    icon,
    iconPosition,
    isDisabled,
    testID,
    accessibilityLabel,
    ...rest
  }: CollapsibleButtonProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleButton must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());
  const isExpanded = $derived(ctx.isExpanded);

  const toggleIsExpanded = () => {
    ctx.onExpandChange(!isExpanded);
  };

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<Button
  {variant}
  {size}
  {icon}
  {iconPosition}
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
</Button>
