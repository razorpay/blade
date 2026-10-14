<script lang="ts">
  import type { Snippet } from 'svelte';
  import OptionListSection from '../option-list/OptionListSection.svelte';

  interface Props {
    /** Figma's section heading. */
    title: string;
    /** The section's ActionListItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID }: Props = $props();
</script>

<!-- An OptionListSection in the list's look: a heading inside the list, or
     a card of its own. -->
<OptionListSection {title} {testID}>{@render children()}</OptionListSection>
