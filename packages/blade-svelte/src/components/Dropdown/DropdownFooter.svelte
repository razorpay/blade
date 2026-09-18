<script lang="ts">
  import { MetaConstants, makeAccessible, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { dropdownFooterClass } from '@razorpay/blade-core/styles';
  import BaseFooter from '../BaseHeaderFooter/BaseFooter.svelte';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownFooterProps } from './types';

  let { children, testID, ...rest }: DropdownFooterProps = $props();

  const dropdown = getDropdownContext();

  // Announce that the overlay has footer actions (switches the ActionList
  // container role to `dialog` — mirrors React `setHasFooterAction(true)`).
  $effect(() => {
    dropdown?.setHasFooterAction(true);
  });

  const isOpen = $derived(dropdown?.isOpen ?? false);

  const a11yAttrs = makeAccessible({ role: 'group' });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={dropdownFooterClass} {...a11yAttrs} {...analyticsAttrs}>
  <BaseFooter metaComponentName={MetaConstants.DropdownFooter} {testID}>
    <!-- Interactive footer children are removed from the DOM while closed so they
         aren't tabbable (mirrors React `isOpen ? children : null`). -->
    {#if isOpen}
      {@render children?.()}
    {/if}
  </BaseFooter>
</div>
