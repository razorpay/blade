<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getDropdown } from '../../runes/dropdown/context';
  import type { IconSource } from '../../runes/icon/source';
  import { getOptionList } from '../../runes/option-list/context';
  import DropdownItem from '../dropdown/DropdownItem.svelte';
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
    /** Inside a Dropdown: also picked, before the value is held. */
    onClick?: () => void;
    /** @default false */
    isDisabled?: boolean;
    testID?: string;
  }

  let { href, target, rel, intent = 'none', onClick, testID, ...row }: Props = $props();

  const inDropdown = Boolean(getDropdown());
  const list = getOptionList<T, OptionListShared>();
  const linkClasses = $derived(
    list
      ? cx(list.shared.classes.row, list.shared.classes.rowState.unpicked, 'no-underline', row.isDisabled && list.shared.classes.rowDisabled)
      : ''
  );
</script>

{#if inDropdown}
  <DropdownItem {...row} {href} {target} {rel} {intent} {onClick} {testID} />
{:else if href}
  <!-- Standalone link row: a navigation between the choices, not one of them. -->
  <a
    class={linkClasses}
    {href}
    {target}
    {rel}
    aria-disabled={row.isDisabled || undefined}
    data-intent={intent === 'none' ? undefined : intent}
    data-testid={testID}
  >
    <ActionListRow classes={POPUP_ITEM} {...row} {intent} />
  </a>
{:else}
  <OptionItem value={row.value} isDisabled={row.isDisabled} text={row.title} {intent} {testID}>
    {#snippet children(state)}
      <ActionListRow
        classes={POPUP_ITEM}
        {...row}
        {intent}
        hasCheck={list?.kind === 'checkbox'}
        isSelected={state.isSelected}
      />
    {/snippet}
  </OptionItem>
{/if}
