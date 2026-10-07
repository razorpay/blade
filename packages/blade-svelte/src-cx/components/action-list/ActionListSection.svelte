<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDropdown } from '../../runes/dropdown/context';
  import DropdownSection from '../dropdown/DropdownSection.svelte';
  import { POPUP_SECTION } from '../shared/popup-list';

  interface Props {
    /** Figma's section heading. */
    title: string;
    /** The section's ActionListItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID }: Props = $props();

  const id = $props.id();
  const inDropdown = Boolean(getDropdown());
</script>

{#if inDropdown}
  <DropdownSection {title} {testID}>{@render children()}</DropdownSection>
{:else}
  <div class={POPUP_SECTION.root} role="group" aria-labelledby={id} data-testid={testID}>
    <div {id} class={POPUP_SECTION.title}>{title}</div>
    {@render children()}
  </div>
{/if}
