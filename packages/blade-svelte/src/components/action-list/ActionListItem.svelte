<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import type { IconSource } from '../../runes/icon/source';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { getCardGroup } from '../../runes/card-group/context';
  import CardGroupItem from '../card-group/CardGroupItem.svelte';
  import type { CardGroupItemClick, CardGroupShared } from '../card-group/styles';
  import ActionListRow from '../shared/ActionListRow.svelte';
  import { POPUP_ITEM, type PopupItemIntent } from '../shared/popup-list';

  interface Props {
    /** What the list holds when this row is picked (ignored for a link row). */
    value: T;
    /** What the row shows, and what typeahead matches. */
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
    /**
     * The row was pressed — by pointer, or Enter or Space — after the pick,
     * as React's: `name` is the row's `value`, `value` whether the row was
     * selected when pressed, and the `event`.
     */
    onClick?: (click: CardGroupItemClick<T>) => void;
    /** @default false */
    isDisabled?: boolean;
    /** On the row's control; else the list's `${testID}-${index}`. */
    testID?: string;
  }

  let {
    href,
    target,
    rel,
    intent = 'none',
    onClick,
    testID,
    value,
    title,
    description,
    leading,
    titleSuffix,
    trailing,
    isDisabled,
    ...rest
  }: Props & AnalyticsAttributes = $props();
  const row = $derived({ value, title, description, leading, titleSuffix, trailing, isDisabled });
  const analytics = $derived(analyticsAttributes(rest));

  const list = getCardGroup<T, CardGroupShared>();
  // The list's look carries the row's parts (a card's 24px logo box).
  const parts = $derived(list?.shared.classes.item ?? POPUP_ITEM);
</script>

<!-- A link row is CardGroupItem's: a navigation between the choices, not one
     of them. In a Menu, its `onClick` closes it. -->
{#if href}
  <CardGroupItem
    value={row.value}
    {href}
    {target}
    {rel}
    title={row.title}
    isDisabled={row.isDisabled}
    {intent}
    {testID}
    onClick={onClick as (click: CardGroupItemClick<T | undefined>) => void}
    {...analytics}
  >
    <ActionListRow classes={parts} {...row} {intent} />
  </CardGroupItem>
{:else}
  <CardGroupItem
    value={row.value}
    isDisabled={row.isDisabled}
    text={row.title}
    {intent}
    {testID}
    {onClick}
    {...analytics}
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
  </CardGroupItem>
{/if}
