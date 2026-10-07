<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { getDropdown, type DropdownEntry } from '../../runes/dropdown/context';
  import type { IconSource } from '../../runes/icon/source';
  import { createPopupItem } from '../../runes/popup-list/item.svelte';
  import ActionListRow from '../shared/ActionListRow.svelte';
  import type { PopupItemIntent } from '../shared/popup-list';
  import { resolveDropdown, type DropdownShared } from './styles';

  // A Dropdown's row: what ActionListItem renders inside a Dropdown.
  interface Props {
    /** What the dropdown holds when this row is picked (ignored for a link row). */
    value: T;
    /** What the row shows, what the select field shows once picked, and what typeahead and a search match. */
    title: string;
    description?: string;
    icon?: IconSource;
    leading?: Snippet;
    titleSuffix?: Snippet;
    trailing?: Snippet;
    /** A link row: picking it follows the link and closes the list. */
    href?: string;
    target?: string;
    rel?: string;
    /** `negative` for a destructive action (not in the select field). @default 'none' */
    intent?: PopupItemIntent;
    /** Also picked: runs before the value is held. */
    onClick?: () => void;
    isDisabled?: boolean;
    testID?: string;
  }

  let {
    value,
    title,
    description,
    icon,
    leading,
    titleSuffix,
    trailing,
    href,
    target,
    rel,
    intent = 'none',
    onClick,
    isDisabled = false,
    testID,
  }: Props = $props();

  const id = $props.id();
  const dropdown = getDropdown<T, DropdownShared>();

  const item = createPopupItem<DropdownEntry<T>>(dropdown, {
    id,
    extra: { value: () => value, isLink: () => Boolean(href) },
    isDisabled: () => isDisabled,
    text: () => title,
    isHidden: () => !(dropdown?.matches(title) ?? true),
    onPick: () => {
      onClick?.();
      // The keyboard picked a link row: follow it as a click would.
      if (href && !clicking) {
        item.entry.getElement()?.click();
      }
    },
  });

  // A click on a link row follows it natively; the pick it makes must not click again.
  let clicking = false;
  function handleLinkClick(): void {
    clicking = true;
    item.handleClick();
    clicking = false;
  }

  const classes = $derived(dropdown?.shared.classes ?? resolveDropdown({}));
  const isSelected = $derived(!href && (dropdown?.isSelected(value) ?? false));
  const isMultiple = $derived(dropdown?.isMultiple ?? false);
  const isHidden = $derived(!(dropdown?.matches(title) ?? true));
  // React refuses a negative row in the select field (its rows are values
  // only): there it draws neutral.
  const tone = $derived<PopupItemIntent>(intent === 'negative' && dropdown?.isSelectField ? 'none' : intent);
  const rowClass = $derived(
    cx(
      classes.item,
      classes.itemState[isDisabled ? 'disabled' : 'enabled'],
      !isDisabled && classes.itemIntent[tone],
      !isMultiple && isSelected && classes.itemSelected,
      isHidden && 'hidden'
    )
  );
</script>

{#snippet row()}
  <ActionListRow
    {classes}
    {title}
    {description}
    {icon}
    {leading}
    {titleSuffix}
    {trailing}
    hasCheck={isMultiple && !href}
    {isSelected}
  />
{/snippet}

<!-- Not focusable: focus stays on the list (or its search), which names
     this row as its active descendant. The list owns the keys. -->
{#if href}
  <a
    {id}
    {href}
    {target}
    {rel}
    tabindex="-1"
    class={rowClass}
    hidden={isHidden || undefined}
    aria-disabled={isDisabled || undefined}
    data-active={item.activeBy}
    data-testid={testID}
    onclick={handleLinkClick}
    onpointermove={item.handlePointerMove}
    onpointerdown={item.handlePointerDown}
    {@attach item.attach}
  >
    {@render row()}
  </a>
{:else}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    {id}
    role="option"
    tabindex="-1"
    class={rowClass}
    hidden={isHidden || undefined}
    aria-selected={isSelected}
    aria-disabled={isDisabled || undefined}
    data-active={item.activeBy}
    data-testid={testID}
    onclick={item.handleClick}
    onpointermove={item.handlePointerMove}
    onpointerdown={item.handlePointerDown}
    {@attach item.attach}
  >
    {@render row()}
  </div>
{/if}
