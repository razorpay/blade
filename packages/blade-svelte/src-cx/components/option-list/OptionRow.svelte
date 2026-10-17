<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import { cx } from '../../cx';
  import { createOptionRow } from '../../runes/option-list/row.svelte';
  import type { OptionRowClasses } from './styles';

  interface Props {
    /** `button`: an action row, which acts and holds nothing. */
    kind: 'radio' | 'checkbox' | 'button';
    /** An action row inside an anchored menu: a `menuitem`. */
    role?: 'menuitem';
    name: string;
    isSelected: boolean;
    isDisabled: boolean;
    isInvalid: boolean;
    /** The keyboard is on this row: draw it, and take focus. */
    isActive: boolean;
    /** The list's one tab stop. */
    isTabStop: boolean;
    /** Focus landed here (Tab, a click): the keyboard continues from it. */
    onFocus: () => void;
    onBlur: () => void;
    /** The list's keys: on the control, so other children of the list keep theirs. */
    onKeyDown: (event: KeyboardEvent) => void;
    /** On the row: how the list orders and focuses the item. */
    attach?: Attachment<HTMLElement>;
    classes: OptionRowClasses;
    /** `negative`: the action look draws the row red. @default 'none' */
    intent?: 'none' | 'negative';
    /** Native-only: the attributes a native row carries. */
    optionState?: Record<string, string>;
    /** A user pick. Returns whether the option is picked afterwards. */
    onToggle: (event: Event) => boolean;
    testID?: string;
    children: Snippet;
  }

  let {
    kind,
    role,
    name,
    isSelected,
    isDisabled,
    isInvalid,
    isActive,
    isTabStop,
    onFocus,
    onBlur,
    onKeyDown,
    attach = () => {},
    intent = 'none',
    classes,
    onToggle,
    testID,
    children,
  }: Props = $props();

  const row = createOptionRow({
    isSelected: () => isSelected,
    isActive: () => isActive,
    onToggle: (event) => onToggle(event),
  });
</script>

{#if kind === 'button'}
  <!-- An action row: a native button owns the press, Enter and Space. -->
  <button
    type="button"
    {role}
    class={cx(
      classes.action ?? 'w-full text-start',
      classes.row,
      classes.rowState.unpicked,
      isActive && classes.rowActive,
      isDisabled && classes.rowDisabled
    )}
    disabled={isDisabled}
    tabindex={isTabStop ? 0 : -1}
    data-intent={intent === 'none' ? undefined : intent}
    data-testid={testID}
    onclick={(event) => onToggle(event)}
    onfocus={onFocus}
    onfocusout={onBlur}
    onkeydown={onKeyDown}
    {@attach attach}
    {@attach row.focus}
  >
    <span class={classes.content}>{@render children()}</span>
  </button>
{:else}
<!-- The web row: a native input per option owns keys and semantics. -->
<label
  class={cx(
    classes.row,
    classes.rowState[isSelected ? 'picked' : 'unpicked'],
    isActive && classes.rowActive,
    isDisabled && classes.rowDisabled
  )}
  data-intent={intent === 'none' ? undefined : intent}
  {@attach attach}
>
  <input
    type={kind}
    class={cx(classes.control[kind], isInvalid && classes.invalid)}
    {name}
    checked={isSelected}
    disabled={isDisabled}
    tabindex={isTabStop ? 0 : -1}
    data-testid={testID}
    onclick={row.handleClick}
    onfocus={onFocus}
    onfocusout={onBlur}
    onkeydown={onKeyDown}
    {@attach row.attach}
  />
  <span class={classes.content}>{@render children()}</span>
</label>
{/if}
