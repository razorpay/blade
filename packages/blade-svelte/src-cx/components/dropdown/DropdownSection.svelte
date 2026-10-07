<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  // A Dropdown's section: what ActionListSection renders inside a Dropdown.
  import { getDropdown } from '../../runes/dropdown/context';
  import { resolveDropdown, type DropdownShared } from './styles';

  interface Props {
    /** Figma's section heading. */
    title: string;
    /** The section's DropdownItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID }: Props = $props();

  const id = $props.id();
  const dropdown = getDropdown<unknown, DropdownShared>();
  const classes = $derived(dropdown?.shared.classes ?? resolveDropdown({}));
</script>

<!-- A search spans sections: the headings step aside while one is typed. -->
<div class={classes.section} role="group" aria-labelledby={id} data-testid={testID}>
  <div
    {id}
    class={cx(classes.sectionTitle, dropdown?.query && 'hidden')}
    hidden={Boolean(dropdown?.query) || undefined}
  >
    {title}
  </div>
  {@render children()}
</div>
