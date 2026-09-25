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
    return () => dropdown?.setHasFooterAction(false);
  });

  const a11yAttrs = makeAccessible({ role: 'group' });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={dropdownFooterClass} {...a11yAttrs} {...analyticsAttrs}>
  <BaseFooter metaComponentName={MetaConstants.DropdownFooter} {testID}>
    <!-- Footer children stay mounted so the button doesn't vanish mid-close-
         transition (which collapsed overlay height → visible jerk). The overlay
         sets `display:none` once fully closed, so children aren't tabbable then. -->
    {@render children?.()}
  </BaseFooter>
</div>
