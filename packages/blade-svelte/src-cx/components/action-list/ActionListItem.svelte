<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getOverlay } from '../../runes/layer/overlay';
  import { createOptionMatch } from '../../runes/option-list/search.svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { getOptionList } from '../../runes/option-list/context';
  import OptionItem from '../option-list/OptionItem.svelte';
  import type { OptionListShared } from '../option-list/styles';
  import ActionListRow from '../shared/ActionListRow.svelte';
  import { POPUP_ITEM, type PopupItemIntent } from '../shared/popup-list';

  interface Props {
    /** What the list holds when this row is picked (ignored for a link row). */
    value: T;
    /** What the row shows, and what typeahead and a search match. */
    title: string;
    /** Under the title, muted; it may wrap. */
    description?: string;
    /**
     * Before the title: an icon (a 16px glyph), or a snippet with an asset
     * (a flag) or an avatar.
     */
    leading?: IconSource | Snippet;
    /** Beside the title: a Badge. */
    titleSuffix?: Snippet;
    /** After the title: a counter, text, a glyph. */
    trailing?: Snippet;
    /** A link row: it navigates instead of holding a value. */
    href?: string;
    target?: string;
    rel?: string;
    /** `negative` for a destructive action: red, with a red wash. @default 'none' */
    intent?: PopupItemIntent;
    /** The row was pressed: with the pick, or the press (`selectionType="none"`, a menu). */
    onClick?: () => void;
    /** @default false */
    isDisabled?: boolean;
    testID?: string;
  }

  let { href, target, rel, intent = 'none', onClick, testID, ...row }: Props = $props();

  const list = getOptionList<T, OptionListShared>();
  // A link row inside a menu closes it as it navigates.
  const overlay = getOverlay();
  // The list's look carries the row's parts (a card's 24px logo box).
  const parts = $derived(list?.shared.classes.item ?? POPUP_ITEM);
  // A link row is no OptionItem: it takes its own part in the list's search
  // (an option row's OptionItem does that).
  const linkMatch = createOptionMatch(() =>
    href ? { title: row.title, value: row.value } : undefined
  );

  function handleLinkClick(): void {
    onClick?.();
    if (overlay?.variant === 'menu') {
      overlay.close();
    }
  }

  const linkClasses = $derived(
    list
      ? cx(list.shared.classes.row, list.shared.classes.rowState.unpicked, 'no-underline', row.isDisabled && list.shared.classes.rowDisabled)
      : ''
  );
</script>

{#if href}
  {#if linkMatch.isShown}
    <!-- A link row: a navigation between the choices, not one of them. -->
    <a
      class={linkClasses}
      role={list?.shared.rowRole}
      {href}
      {target}
      {rel}
      onclick={handleLinkClick}
      aria-disabled={row.isDisabled || undefined}
      data-intent={intent === 'none' ? undefined : intent}
      data-testid={testID}
    >
      <ActionListRow classes={parts} {...row} {intent} />
    </a>
  {/if}
{:else}
  <OptionItem
    value={row.value}
    isDisabled={row.isDisabled}
    text={row.title}
    {intent}
    {testID}
    {onClick}
  >
    {#snippet children(state)}
      <ActionListRow
        classes={parts}
        {...row}
        {intent}
        hasCheck={list?.kind === 'checkbox'}
        isSelected={state.isSelected}
      />
    {/snippet}
  </OptionItem>
{/if}
