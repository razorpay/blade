<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getOptionList } from '../../runes/option-list/context';
  import { createOptionListSection } from '../../runes/option-list/search.svelte';
  import { resolveOptionList, type OptionListShared } from './styles';

  interface Props {
    /** The heading over the section's options; it names the group. */
    title: string;
    /** The section's OptionItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID }: Props = $props();

  const id = $props.id();
  const list = getOptionList<unknown, OptionListShared>();
  const section = createOptionListSection();
  // The list's look: a heading inside one box, or a box of its own.
  const parts = $derived(
    list?.shared.classes.section ?? resolveOptionList({}).section!
  );
</script>

<!-- A titled group of options. A search that leaves it no row hides it,
     heading and all; its rows stay mounted, as they decide what passes. -->
<div
  class={cx(parts.root, section.isHidden && 'hidden')}
  role="group"
  aria-labelledby={id}
  data-testid={testID}
>
  <div class={parts.separator} role="presentation"></div>
  <div {id} class={parts.title}>{title}</div>
  <div class={parts.box}>{@render children()}</div>
</div>
