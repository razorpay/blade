<script lang="ts">
  import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
  import { getCollapsibleChevronClasses } from '@razorpay/blade-core/styles';
  import { makeAccessible } from '@razorpay/blade-core/utils';
  import { getCollapsibleContext } from './context';
  import type { IconProps } from '../Icons/types';

  // Rendered by Button/Link as `<Icon size color />`, so accept IconProps.
  let { size, color }: IconProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleChevronIcon must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());
  const isExpanded = $derived(ctx.isExpanded);
  const chevronClass = $derived(getCollapsibleChevronClasses({ isExpanded }));
  const a11y = makeAccessible({ hidden: true });
</script>

<span class={chevronClass} {...a11y}>
  <ChevronDownIcon {size} {color} />
</span>
