<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDropdown } from '../../runes/dropdown/context';
  import DropdownSection from '../dropdown/DropdownSection.svelte';
  import OptionListSection from '../option-list/OptionListSection.svelte';

  interface Props {
    /** Figma's section heading. */
    title: string;
    /** The section's ActionListItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID }: Props = $props();

  const inDropdown = Boolean(getDropdown());
</script>

<!-- A Dropdown's section, or standalone an OptionListSection in the list's
     look (a heading inside the list, or a card of its own). -->
{#if inDropdown}
  <DropdownSection {title} {testID}>{@render children()}</DropdownSection>
{:else}
  <OptionListSection {title} {testID}>{@render children()}</OptionListSection>
{/if}
