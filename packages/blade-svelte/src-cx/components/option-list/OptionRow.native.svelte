<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import type { OptionRowClasses } from './styles';

  // The native row: a pressable container carrying `checked`/`disabled` as
  // plain attributes, which drive the platform's `checked:` style variants.
  interface Props {
    kind: 'radio' | 'checkbox';
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    classes: OptionRowClasses;
    /** The action look's tone; native draws no intent yet. */
    intent?: 'none' | 'negative';
    optionState?: Record<string, string>;
    onToggle: (event: Event) => boolean;
    /** On the row: how the list orders the item. */
    attach?: Attachment<HTMLElement>;
    testID?: string;
    children: Snippet;
  }

  // The web twin's keyboard props (`isActive`, `isTabStop`, `onFocus`,
  // `onBlur`, `onKeyDown`) and `name` have no meaning here: the platform
  // moves focus between rows itself, and a native row is not a form input.
  let {
    kind,
    isSelected,
    isDisabled,
    isInvalid,
    classes,
    optionState,
    onToggle,
    attach = () => {},
    testID,
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
  role={kind}
  aria-checked={isSelected}
  aria-disabled={isDisabled || undefined}
  aria-invalid={isInvalid || undefined}
  data-testid={testID}
  {...optionState}
  onclick={onToggle}
  {@attach attach}
>
  <span class={classes.content}>{@render children()}</span>
</div>
