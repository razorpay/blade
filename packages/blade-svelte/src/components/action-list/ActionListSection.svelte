<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { AnalyticsAttributes } from '../../runes/dom/analytics';
  import CardGroupSection from '../card-group/CardGroupSection.svelte';

  interface Props {
    /** Figma's section heading. */
    title: string;
    /** The section's ActionListItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID, ...analytics }: Props & AnalyticsAttributes = $props();
</script>

<!-- A CardGroupSection in the list's look: a heading inside the list, or
     a card of its own. -->
<CardGroupSection {title} {testID} {...analytics}>{@render children()}</CardGroupSection>
