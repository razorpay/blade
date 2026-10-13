<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createCollapsible } from '../../runes/collapsible/collapsible.svelte';
  import { provideCollapsible } from '../../runes/collapsible/context';
  import CollapsePanel from '../shared/CollapsePanel.svelte';
  import { resolveCollapsible } from './styles';

  interface Props {
    /**
     * Whether the body shows: the initial state, a `bind:isExpanded`, or a
     * value the host keeps driving — so there is no `defaultIsExpanded`.
     * @default false
     */
    isExpanded?: boolean;
    onExpandChange?: (change: { isExpanded: boolean }) => void;
    /** Where the body opens: under the trigger, or above it. @default 'bottom' */
    direction?: 'bottom' | 'top';
    /**
     * The trigger: a Button or a Link. The wrapper around it toggles the
     * body on a click (a press, Enter or Space), so it wires nothing;
     * `isExpanded` is there to read. Its first focusable element gets
     * `aria-expanded` and `aria-controls`. Put a CollapsibleChevron in it
     * for Blade's CollapsibleLink look.
     */
    children: Snippet<[{ isExpanded: boolean }]>;
    /** The body: what the trigger reveals. */
    content: Snippet;
    testID?: string;
    class?: string;
  }

  let {
    isExpanded = $bindable(false),
    onExpandChange,
    direction = 'bottom',
    children,
    content,
    testID,
    class: className = '',
  }: Props = $props();

  const uid = $props.id();
  const classes = resolveCollapsible();
  const collapsible = createCollapsible({
    id: uid,
    isExpanded: () => isExpanded,
    onValue: (next) => {
      isExpanded = next;
    },
    onExpandChange: (next) => onExpandChange?.({ isExpanded: next }),
    direction: () => direction,
  });
  provideCollapsible(collapsible);
</script>

<div class={cx(classes.root[direction], className)} data-testid={testID}>
  <!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
  <span class={classes.trigger} onclick={collapsible.toggle} {@attach collapsible.trigger}>
    {@render children({ isExpanded: collapsible.isExpanded })}
  </span>
  {#if collapsible.isExpanded}
    <CollapsePanel id={collapsible.bodyId} duration={280} scrollIntoView={false}>
      <div class={classes.body[direction]}>
        {@render content()}
      </div>
    </CollapsePanel>
  {/if}
</div>
