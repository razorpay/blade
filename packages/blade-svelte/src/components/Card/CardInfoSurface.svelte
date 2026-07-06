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
  }: {
    /** Content of the emphasized (white) header section. */
    topSection: Snippet;
    /** Content of the subtle (gray) body section. */
    bottomSection: Snippet;
    /** Interactive overlay (link/button) that spans the whole card. */
    children?: Snippet;
    isSelected?: boolean;
  } = $props();
</script>

<div class={tc.cardInfoWrapper} data-selected={isSelected ? 'true' : undefined}>
  {#if children}
    {@render children()}
  {/if}
  <div class={tc.cardInfoSectionTop}>
    {@render topSection()}
  </div>
  <div class={tc.cardInfoSectionBottom}>
    {@render bottomSection()}
  </div>
</div>
