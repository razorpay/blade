<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDropdown } from '../../runes/dropdown/context';
  import { resolveDropdown, type DropdownShared } from './styles';

  interface Props {
    /** Figma's footer actions (a secondary and a primary Button), or any content. */
    children: Snippet;
    testID?: string;
  }

  let { children, testID }: Props = $props();

  const dropdown = getDropdown<unknown, DropdownShared>();
  const classes = $derived(dropdown?.shared.classes ?? resolveDropdown({}));
</script>

<div class={classes.footer} data-testid={testID}>{@render children()}</div>
