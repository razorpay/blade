<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import { getOverlay } from '../../runes/layer/overlay';
  import { createOwnSearch, type OptionSearchItem } from '../../runes/option-list/search.svelte';
  import type { FieldChange } from '../shared/change';
  import { cx } from '../../cx';
  import OptionList from '../option-list/OptionList.svelte';
  import VirtualOptionList from '../option-list/VirtualOptionList.svelte';
  import type { OptionListValidationState, OptionSection, OptionState } from '../option-list/styles';
  import SearchInput from '../search-input/SearchInput.svelte';
  import { actionListClasses, type ActionListVariant } from './styles';

  /**
   * The search is the list's own (`isSearchable`: a SearchInput above the
   * rows, holding its query) or the caller's (`query`, bound from a field
   * placed wherever the design wants it) — never both.
   */
  type OwnSearch = {
    /**
     * Draws a SearchInput above the rows and searches as it is typed: rows
     * whose title does not hold the text (ignoring case and outer spaces)
     * are not drawn, and a section left with none steps aside. `match`
     * replaces the title match; `empty` shows while nothing is left. On a
     * data-driven list the title is `itemText`, which is then required.
     * @default false
     */
    isSearchable: true;
    /** The search field's placeholder, and its name. @default 'Search' */
    searchPlaceholder?: string;
    query?: never;
  };
  type GivenSearch = {
    isSearchable?: false;
    searchPlaceholder?: never;
    /**
     * The search: rows whose title does not hold it (ignoring case and
     * outer spaces) are not drawn, and a section left with none steps
     * aside. Bind a SearchInput's value to it. On a data-driven list the
     * title is `itemText`: pass it, or nothing matches.
     */
    query?: string;
  };

  /** Composed rows: ActionListItems and ActionListSections, and anything between them. */
  type ComposedRows = {
    children: Snippet;
    virtualizedItems?: never;
    virtualizedSections?: never;
    itemKey?: never;
    itemText?: never;
    isItemDisabled?: never;
  };
  /**
   * Data-driven rows: only the rows in view mount, so the list must know
   * them all up front, and `children` renders one row — an ActionListItem —
   * per item. `Text` is `itemText`, required while the list is searchable
   * (the search matches it) and optional otherwise (typeahead only).
   */
  type DataRows<Text> = Text & {
    /** Identifies an item across re-orders and filtering; unique across sections. */
    itemKey: (item: T) => string;
    /** What the keyboard skips and the list refuses. */
    isItemDisabled?: (item: T, index: number) => boolean;
    children: Snippet<[T, OptionState]>;
  } & (
      | { virtualizedItems: readonly T[]; virtualizedSections?: never }
      | {
          /**
           * The items in titled sections: each heading is a row of its own,
           * scrolled with the rest, under one window. Keys must be unique
           * across sections.
           */
          virtualizedSections: readonly OptionSection<T>[];
          virtualizedItems?: never;
        }
    );
  /** The item's text: typeahead, and the search's match. */
  type RequiredText = { itemText: (item: T) => string };
  type OptionalText = { itemText?: (item: T) => string };

  /**
   * The rows are composed or data, and the search is the list's own or the
   * caller's: four shapes, exclusive at the type level. A searchable
   * data-driven list requires `itemText`.
   */
  type RowsAndSearch =
    | (OwnSearch & (ComposedRows | DataRows<RequiredText>))
    | (GivenSearch & (ComposedRows | DataRows<OptionalText>));

  interface BaseProps {
    /** The pick, an array with `selectionType="multiple"`; bindable. */
    value?: T | readonly T[] | null;
    /**
     * A user pick changed the value; with `selectionType="none"`, a row was
     * pressed (`value` is that row's).
     */
    onChange?: (change: FieldChange<T | readonly T[] | null>) => void;
    /**
     * `single`: one pick. `multiple`: rows lead with a checkbox; the value
     * is an array. `none`: rows act and hold nothing — a press reports
     * through `onChange` (a bank list that moves on). Inside a Modal
     * `variant="menu"` every row acts and closes the menu: `none`.
     * @default 'single'
     */
    selectionType?: 'single' | 'multiple' | 'none';
    /**
     * `plain`: Menu's rows, in no box. `card`: rows divided
     * by hairlines in a bordered box — each ActionListSection its own box,
     * its heading above it.
     * @default 'plain'
     */
    variant?: ActionListVariant;
    /**
     * Replaces the title match: whether a row passes the query, typed into
     * the list's own search (`isSearchable`) or passed as `query`.
     */
    match?: (item: OptionSearchItem<T>, query: string) => boolean;
    /**
     * Shown in place of the rows while a `query` leaves none, in a status
     * region that announces it.
     */
    empty?: Snippet<[{ query: string }]>;
    /** Single: picking the pick clears it. @default false */
    isDeselectable?: boolean;
    compare?: (a: T, b: T) => boolean;
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    validationState?: OptionListValidationState;
    label?: string;
    helpText?: string;
    errorText?: string;
    /** Names the list when there is no `label`. */
    accessibilityLabel?: string;
    testID?: string;
    class?: string;
  }

  type Props = BaseProps & RowsAndSearch;

  let {
    children,
    virtualizedItems,
    virtualizedSections,
    itemKey,
    itemText,
    isItemDisabled,
    value = $bindable(null),
    variant = 'plain',
    selectionType: givenSelectionType = 'single',
    isSearchable = false,
    searchPlaceholder = 'Search',
    query: givenQuery = '',
    match,
    class: className = '',
    ...rest
  }: Props = $props();

  // A long list takes its rows as data: a snippet is opaque, so a virtual
  // list cannot learn its rows by letting them mount and register.
  const isVirtual = $derived(Boolean(virtualizedItems || virtualizedSections));
  // One `match` contract for both forms: it sees `{ title, value }`. The
  // virtual list matches its data, so the row's title is its `itemText`.
  const virtualMatch = $derived(
    match && ((item: T, q: string) => match({ title: itemText?.(item) ?? '', value: item }, q))
  );

  // Inside a Modal `variant="menu"` the rows act and close it (the menu's
  // intent, however the modal shows); the list cannot hold a pick there.
  const overlay = getOverlay();
  const selectionType = $derived(overlay?.variant === 'menu' ? 'none' : givenSelectionType);

  // The list's own search holds what is typed; otherwise the caller's query.
  const own = createOwnSearch();
  const query = $derived(isSearchable ? own.query : givenQuery);
</script>

<!-- OptionList's anatomy and behaviour — the search, the sections, the
     empty state — in ActionList's look: composed, or virtual over data. -->
{#snippet list(listClass: string)}
  {#if isVirtual && itemKey}
    <VirtualOptionList
      bind:value
      classes={actionListClasses(variant)}
      items={virtualizedItems}
      sections={virtualizedSections}
      {itemKey}
      {itemText}
      {isItemDisabled}
      {selectionType}
      {query}
      match={virtualMatch}
      class={listClass}
      children={children as Snippet<[T, OptionState]>}
      {...rest}
    />
  {:else}
    <OptionList
      bind:value
      classes={actionListClasses(variant)}
      {selectionType}
      {query}
      {match}
      class={listClass}
      {...rest}
    >
      {@render (children as Snippet)()}
    </OptionList>
  {/if}
{/snippet}

{#if isSearchable}
  <!-- The search above the rows, 24px apart; the list takes the width and
       the remaining height. -->
  <div class={cx('flex min-h-0 flex-col gap-6', className)}>
    <SearchInput
      bind:value={own.query}
      placeholder={searchPlaceholder}
      accessibilityLabel={searchPlaceholder}
      testID={rest.testID ? `${rest.testID}-search` : undefined}
    />
    {@render list(isVirtual ? 'min-h-0 flex-1' : '')}
  </div>
{:else}
  {@render list(className)}
{/if}
