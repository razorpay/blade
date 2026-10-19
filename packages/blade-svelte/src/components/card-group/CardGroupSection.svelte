<script lang="ts">
  import type { Snippet } from 'svelte';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getCardGroup } from '../../runes/card-group/context';
  import { registerCardGroupSection } from '../../runes/card-group/sections.svelte';
  import { resolveCardGroup, type CardGroupShared } from './styles';

  interface Props {
    /** The heading over the section's options; it names the group. */
    title: string;
    /** The section's CardGroupItems. */
    children: Snippet;
    testID?: string;
  }

  let { title, children, testID, ...rest }: Props & AnalyticsAttributes = $props();

  const id = $props.id();
  const list = getCardGroup<unknown, CardGroupShared>();
  registerCardGroupSection();
  // The list's look: a heading inside one box, or a box of its own.
  const parts = $derived(
    list?.shared.classes.section ?? resolveCardGroup({}).section!
  );
</script>

<!-- A titled group of options. -->
<div
  class={parts.root}
  role="group"
  aria-labelledby={id}
  data-testid={testID}
  {...analyticsAttributes(rest)}
>
  <div class={parts.separator} role="presentation"></div>
  <div {id} class={parts.title}>{title}</div>
  <div class={parts.box}>{@render children()}</div>
</div>
