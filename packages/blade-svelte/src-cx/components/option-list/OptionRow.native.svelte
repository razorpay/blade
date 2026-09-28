<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import type { OptionRowClasses } from './styles';

  // The native row: a pressable container carrying `checked`/`disabled` as
  // plain attributes, which drive the platform's `checked:` style variants.
  interface Props {
    isSelected: boolean;
    isDisabled: boolean;
    classes: OptionRowClasses;
    optionState?: Record<string, string>;
    onToggle: (event: Event) => boolean;
    /** On the row: how the list orders the item. */
    attach?: Attachment<HTMLElement>;
    children: Snippet;
  }

  let {
    isSelected,
    isDisabled,
    classes,
    optionState,
    onToggle,
    attach = () => {},
    children,
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div
  class={cx(
    classes.row,
    classes.rowState[isSelected ? 'picked' : 'unpicked'],
    isDisabled && classes.rowDisabled
  )}
  {...optionState}
  onclick={onToggle}
  {@attach attach}
>
  <span class={classes.content}>{@render children()}</span>
</div>
