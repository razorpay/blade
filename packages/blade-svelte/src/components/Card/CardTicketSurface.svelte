<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';

  // Call in the script block so the class names aren't tree-shaken from the CSS module.
  const tc = getCardTemplateClasses();

  let {
    topSection,
    bottomSection,
    children,
    isSelected = false,
    isDisabled = false,
  }: {
    /** Content of the top section (above the tear line). */
    topSection: Snippet;
    /** Content of the bottom section (below the tear line). */
    bottomSection: Snippet;
    /** Interactive overlay (link/button) that spans the whole ticket. */
    children?: Snippet;
    isSelected?: boolean;
    isDisabled?: boolean;
  } = $props();
</script>

<div
  class={tc.cardTicketWrapper}
  data-selected={isSelected ? 'true' : undefined}
  data-disabled={isDisabled ? 'true' : undefined}
>
  <div class="{tc.cardTicketSection} {tc.cardTicketSectionTop}">
    {@render topSection()}
  </div>
  <div class="{tc.cardTicketSection} {tc.cardTicketSectionBottom}">
    <span class="{tc.cardTicketNotch} {tc.cardTicketNotchLeft}" aria-hidden="true"></span>
    <span class="{tc.cardTicketNotch} {tc.cardTicketNotchRight}" aria-hidden="true"></span>
    {@render bottomSection()}
  </div>
  {#if children}
    {@render children()}
  {/if}
</div>
