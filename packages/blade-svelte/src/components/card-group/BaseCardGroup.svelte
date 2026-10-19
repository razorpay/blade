<script lang="ts" generics="T">
  import { pickHintText } from '../../runes/form/hint';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import VirtualWindow from '../virtual-window/VirtualWindow.svelte';
  import CardGroupSection from './CardGroupSection.svelte';
  import { provideCardGroup } from '../../runes/card-group/context';
  import { createCardGroup } from '../../runes/card-group/list.svelte';
  import { layoutDataRows, openingRow, optionKey } from '../../runes/card-group/rows';
  import { provideCardGroupSections } from '../../runes/card-group/sections.svelte';
  import type {
    CardGroupChange,
    CardGroupClassesProp,
    CardGroupDataSection,
    CardGroupShared,
    CardGroupValidationState,
    CardGroupView,
  } from './styles';

  // CardGroup's anatomy and behaviour with the look handed in: CardGroup
  // hands its own, ActionList a menu's. Not exported — the public lists
  // take style props, as every other component.
  interface Props {
    /**
     * The pick — an array of picks with `selectionType="multiple"`: the initial one, a
     * `bind:value`, or a value the host keeps driving.
     */
    value?: T | readonly T[] | null;
    /**
     * `single`: radios. `multiple`: checkboxes; the value is an array.
     * @default 'single'
     */
    selectionType?: 'single' | 'multiple';
    /**
     * A user pick changed the value: `{ name, value }`, with `value` shaped
     * as `bind:value` (an array for a multiple choice).
     */
    onChange?: (change: CardGroupChange<T>) => void;
    /**
     * Every user pick — by pointer, or Enter or Space — with the row's own
     * value, whether the list's value changed or not: where a pick submits
     * (a bank list that moves on), picking the same row again still reports.
     */
    onPick?: (pick: { name?: string; value: T }) => void;
    /**
     * The options as data, in order. Each CardGroupItem inside finds its
     * place by its `value`, wherever it sits — so the list may mount only
     * some (a virtual window) and put anything around them (section
     * headings). Without it the options are the CardGroupItems, in document
     * order. Fixed at mount: data or not.
     */
    items?: readonly T[];
    /**
     * The options as data in titled sections, in place of `items`; a
     * section with no options is left out. Needs `row`.
     */
    sections?: readonly CardGroupDataSection<T>[];
    /**
     * With `items` or `sections`: renders one option's row (a CardGroupItem
     * or an ActionListItem with `value={item}`). The list then lays its rows
     * out itself, and `children` may be left out.
     */
    row?: Snippet<[T]>;
    /**
     * With `row`: identifies an option across re-orders and searches — the
     * rows' keys, and what a virtual window remembers measured heights by.
     * @default the option itself, for strings and numbers
     */
    itemKey?: (item: T) => string;
    /**
     * With `row`: mounts only the rows in view, for long lists (React's
     * `isVirtualized`). Give the list a bounded height in `class`.
     * @default false
     */
    isVirtualized?: boolean;
    /** With `items`: the option's text, for typeahead. */
    itemText?: (option: T) => string;
    /** With `items`: what the keyboard skips and the list refuses. */
    isItemDisabled?: (option: T, index: number) => boolean;
    /** Defaults to identity; pass it when options are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    /** Single choice: picking the picked option clears it. @default false */
    isDeselectable?: boolean;
    /** The look: a whole class map, or one per list state. */
    classes: CardGroupClassesProp;
    /** Single choice: the arrows pick as they move (a radio group's), or only move (a listbox's). */
    selectsOnMove: boolean;
    /** Registers the list with the enclosing Form under this key. */
    name?: string;
    /** @default false */
    isRequired?: boolean;
    /** @default false */
    isDisabled?: boolean;
    /**
     * Omit inside a Form: the list mirrors its own form error once an option
     * was picked or a submit was attempted. Pass it to own the state.
     */
    validationState?: CardGroupValidationState;
    /**
     * The line under the options while the state is `none`, and the stand-in
     * for `errorText`. Inside a Form a visible field error replaces the line
     * while it lasts.
     */
    helpText?: string | Snippet;
    /** The line while `validationState` is `error`. */
    errorText?: string | Snippet;
    label?: string;
    /** Names the list when there is no visible `label`. */
    accessibilityLabel?: string;
    /**
     * Lands on the root; each item's control without a test id of its own
     * gets `${testID}-${index}`.
     */
    testID?: string;
    class?: string;
    /**
     * The CardGroupItems, in order, and anything else between them — a
     * heading, a note, a "show all" button. Only CardGroupItems are options:
     * the rest is outside the value and the keyboard. With `items`, it gets
     * where the keyboard is (`CardGroupView`), for a window that mounts a
     * slice. With `row`, it renders after the rows.
     */
    children?: Snippet<[CardGroupView]>;
  }

  let {
    value = $bindable(),
    selectionType = 'single',
    onChange,
    onPick,
    items,
    sections: dataSections,
    row,
    itemKey,
    isVirtualized = false,
    itemText,
    isItemDisabled,
    compare,
    isDeselectable = false,
    classes: look,
    selectsOnMove,
    name,
    isRequired = false,
    isDisabled = false,
    validationState,
    helpText,
    errorText,
    label,
    accessibilityLabel,
    testID,
    class: className = '',
    children,
    ...rest
  }: Props & AnalyticsAttributes = $props();

  const isMultiple = $derived(selectionType === 'multiple');
  const uid = $props.id();
  // Blade's two lines, one shown: the state's own, else the help text.
  const lineText = $derived(pickHintText({ validationState, helpText, errorText }));
  // The rows as data, laid out flat: the options the list holds, and the
  // headings a virtual window mounts between them.
  const layout = $derived(row ? layoutDataRows(items, dataSections, itemKey) : undefined);
  const options = $derived(layout ? layout.options : items);
  const isWindowed = $derived(Boolean(layout && isVirtualized));
  // Rows from data with none to show (a search emptied them), and nothing
  // after them: no rows box, so no empty frame or gutter; the label and
  // the hint stay.
  const hasRowsBox = $derived(!layout || layout.options.length > 0 || Boolean(children));
  const sections = provideCardGroupSections();
  const hasSections = $derived(sections.hasSections || Boolean(row && dataSections));
  const classes = $derived(typeof look === 'function' ? look({ hasSections }) : look);
  // svelte-ignore state_referenced_locally
  const list = createCardGroup<T, CardGroupShared>({
    id: uid,
    items: options && (() => options ?? []),
    itemText,
    isItemDisabled: (option, index) => Boolean(isItemDisabled?.(option, index)),
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) =>
      onChange?.(
        isMultiple
          ? { name, value: Array.isArray(next) ? [...next] : next == null ? [] : [next as T] }
          : { name, value: (next as T | null) ?? null }
      ),
    isMultiple: () => isMultiple,
    onPick: (option) => onPick?.({ name, value: option }),
    compare,
    isDeselectable: () => isDeselectable,
    selectsOnMove: () => selectsOnMove,
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({ classes, testID }),
  });
  provideCardGroup(list);

  const hint = $derived(list.hint);
  const view: CardGroupView = {
    get activeIndex() {
      return list.isKeyboardFocused ? list.activeIndex : -1;
    },
    get tabStop() {
      return list.tabStop;
    },
  };
  // A radio group says it is required and invalid; a group of checkboxes
  // has no such state (`group` takes neither).
  const isRadioGroup = $derived(!isMultiple);
</script>

{#snippet dataRows(render: Snippet<[T]>)}
  {#if dataSections}
    {#each dataSections as section (section.key)}
      {#if section.items.length}
        <CardGroupSection title={section.title}>
          {#each section.items as item, index (optionKey(itemKey, item, index))}
            {@render render(item)}
          {/each}
        </CardGroupSection>
      {/if}
    {/each}
  {:else}
    {#each items ?? [] as item, index (optionKey(itemKey, item, index))}
      {@render render(item)}
    {/each}
  {/if}
{/snippet}

{#snippet windowed(render: Snippet<[T]>)}
  {@const rows = layout!}
  <!-- Opens at the pick, so a long list shows what is chosen, not its top;
       follows the keyboard to rows not mounted. -->
  <VirtualWindow
    keys={rows.keys}
    reveal={rows.rowOf[view.activeIndex] ?? -1}
    startAt={openingRow(rows, view.tabStop)}
    class={classes.virtual.viewport}
    contentClass={classes.virtual.rows}
  >
    {#snippet children(range)}
      {#each rows.rows.slice(range.start, range.end) as line (line.key)}
        {#if line.kind === 'title'}
          <div class={classes.virtual.title[line.isFirst ? 'first' : 'rest']}>{line.title}</div>
        {:else if line.frame && classes.virtual.rowFrame[line.frame]}
          <div class={classes.virtual.rowFrame[line.frame]}>{@render render(line.option)}</div>
        {:else}
          {@render render(line.option)}
        {/if}
      {/each}
    {/snippet}
  </VirtualWindow>
{/snippet}

<!-- A pointer press anywhere hides the keyboard ring until the next key. -->
<div
  class={cx(
    classes.root,
    isWindowed && classes.virtual.root,
    isDisabled && classes.disabled,
    className
  )}
  role={isMultiple ? 'group' : 'radiogroup'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? list.labelId : undefined}
  aria-required={isRequired && isRadioGroup ? 'true' : undefined}
  aria-invalid={list.isInvalid && isRadioGroup ? 'true' : undefined}
  aria-describedby={hint.text ? list.hintId : undefined}
  data-testid={testID}
  {...analyticsAttributes(rest)}
  onpointerdown={list.handlePointerDown}
>
  {#if label}
    <FieldLabel id={list.labelId} text={label} />
  {/if}
  {#if hasRowsBox}
    <div class={isWindowed ? classes.virtual.options : classes.options}>
      {#if row && isWindowed}
        {@render windowed(row)}
      {:else if row}
        {@render dataRows(row)}
      {/if}
      {@render children?.(view)}
    </div>
  {/if}
  {#if hint.text}
    <FieldHint
      id={list.hintId}
      text={hint.text}
      tone={hint.validationState === 'error' ? 'error' : 'help'}
    />
  {/if}
</div>
