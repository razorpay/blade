<script lang="ts" module>
  import type { OptionSection as Section } from './styles';

  type Frame = 'only' | 'first' | 'middle' | 'last';
  type LayoutRow<T> =
    | { kind: 'title'; key: string; title: string; isFirst: boolean }
    | { kind: 'option'; key: string; option: T; index: number; frame?: Frame };

  /** The window's rows from the options or sections, and each option's row. */
  function layoutRows<T>(
    options: readonly T[] | undefined,
    sections: readonly Section<T>[] | undefined,
    optionKey: (option: T) => string
  ): { rows: LayoutRow<T>[]; keys: string[]; options: T[]; rowOf: number[] } {
    const rows: LayoutRow<T>[] = [];
    const flat: T[] = [];
    const rowOf: number[] = [];
    const add = (option: T, frame?: Frame): void => {
      rowOf.push(rows.length);
      rows.push({ kind: 'option', key: optionKey(option), option, index: flat.length, frame });
      flat.push(option);
    };
    if (sections) {
      for (const section of sections) {
        const count = section.options.length;
        if (count === 0) {
          continue;
        }
        // Headings are keyed apart from options, whose keys are the caller's.
        rows.push({
          kind: 'title',
          key: `\u00a7${section.key}`,
          title: section.title,
          isFirst: rows.length === 0,
        });
        section.options.forEach((option, at) =>
          add(
            option,
            count === 1 ? 'only' : at === 0 ? 'first' : at === count - 1 ? 'last' : 'middle'
          )
        );
      }
    } else {
      (options ?? []).forEach((option) => add(option));
    }
    return { rows, keys: rows.map((row) => row.key), options: flat, rowOf };
  }

  /** The options among rows `start` to `end - 1`, as indices among the options. */
  function optionSpan<T>(rows: LayoutRow<T>[], start: number, end: number): { start: number; end: number } {
    let first = -1;
    let last = -1;
    for (let at = start; at < end; at += 1) {
      const row = rows[at];
      if (row?.kind === 'option') {
        first = first < 0 ? row.index : first;
        last = row.index;
      }
    }
    return first < 0 ? { start: 0, end: 0 } : { start: first, end: last + 1 };
  }
</script>

<script lang="ts" generics="T">
  import { pickHintText } from '../../runes/form/hint';
  import type { FieldChange } from '../shared/change';
  import { useComponentDefaults } from '../defaults';
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import FieldHint from '../shared/FieldHint.svelte';
  import FieldLabel from '../shared/FieldLabel.svelte';
  import { provideOptionList } from '../../runes/option-list/context';
  import { createOptionList } from '../../runes/option-list/list.svelte';
  import VirtualWindow from '../virtual/VirtualWindow.svelte';
  import { clearOptionListSearch, textMatches } from '../../runes/option-list/search.svelte';
  import VirtualOptionRow from './VirtualOptionRow.svelte';
  import {
    resolveOptionList,
    type OptionListClassesProp,
    type OptionSection,
    type OptionListShared,
    type OptionListStyleProps,
    type OptionListValidationState,
    type OptionState,
  } from './styles';

  interface BehaviourProps {
    /**
     * Every option, as data: the list mounts only the rows in view, so it
     * must know them all up front — for the keyboard, typeahead and opening
     * at the pick.
     */
    options?: readonly T[];
    /**
     * The options in titled sections, in place of `options`: each section's
     * heading is a row of its own, scrolled with the rest; the keyboard runs
     * across sections as one list. An empty section is left out.
     */
    sections?: readonly OptionSection<T>[];
    /** Identifies an option across re-orders and filtering. */
    optionKey: (option: T) => string;
    /** What the keyboard skips and the list refuses. */
    isOptionDisabled?: (option: T, index: number) => boolean;
    /** Enables typeahead: the text a typed prefix is matched against. */
    optionText?: (option: T) => string;
    /**
     * The pick — an array of picks with `selectionType="multiple"`: the initial one, a
     * `bind:value`, or a value the host keeps driving.
     */
    value?: T | readonly T[] | null;
    /**
     * `single`: radios. `multiple`: checkboxes; the value is an array.
     * `none`: action rows — buttons that hold nothing; each press reports
     * through `onChange` with the row's value.
     * @default 'single'
     */
    selectionType?: 'single' | 'multiple' | 'none';
    onChange?: (change: FieldChange<T | readonly T[] | null>) => void;
    /** Defaults to identity; pass it when options are rebuilt objects. */
    compare?: (a: T, b: T) => boolean;
    isDeselectable?: boolean;
    /**
     * The list's look as a whole class map (`OptionListClasses`), or one per
     * list state (`actionListClasses('card')`), in place of the built-in
     * look: how a library brings its own rows (ActionList does). The anatomy
     * and behaviour stay OptionList's.
     */
    classes?: OptionListClassesProp;
    /**
     * The search: options whose `optionText` does not hold it, ignoring case
     * and outer spaces, are left out — and a section left with none. The
     * data is filtered before it is laid out. Bind a SearchInput's value to it.
     */
    query?: string;
    /** Replaces the `optionText` match: whether an option passes the `query`. */
    filter?: (option: T, query: string) => boolean;
    /**
     * Shown in place of the rows while a `query` leaves none, in a status
     * region that announces it.
     */
    empty?: Snippet<[{ query: string }]>;
    name?: string;
    isRequired?: boolean;
    isDisabled?: boolean;
    validationState?: OptionListValidationState;
    helpText?: string;
    errorText?: string;
    label?: string;
    accessibilityLabel?: string;
    /** Lands on the root; each row's control gets `${testID}-${index}`. */
    testID?: string;
    /** Give the list a bounded height here (`h-80`): the rows scroll inside it. */
    class?: string;
    /**
     * One row: an OptionItem for the option. Rows may be of any height;
     * they are measured as they appear.
     */
    children: Snippet<[T, OptionState]>;
  }

  type Props = BehaviourProps & OptionListStyleProps;

  let {
    options: flatOptions,
    sections,
    optionKey,
    isOptionDisabled,
    optionText,
    value = $bindable(),
    selectionType = 'single',
    onChange,
    compare,
    isDeselectable = false,
    classes: customClasses,
    query = '',
    filter,
    empty,
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
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('OptionList', () => styleProps);

  // What the window mounts: a heading row per section, then its options.
  // The keyboard, typeahead and the value see the options alone, so the
  // rows map each option to its index among them.
  // The search filters the data; the rows know nothing of it. A list around
  // this one keeps its own search to itself.
  clearOptionListSearch();
  function passes(option: T): boolean {
    return filter ? filter(option, query) : textMatches(optionText?.(option) ?? '', query);
  }
  const isSearching = $derived(query.trim() !== '');
  const shownOptions = $derived(isSearching ? flatOptions?.filter(passes) : flatOptions);
  const shownSections = $derived(
    isSearching
      ? sections?.map((section) => ({ ...section, options: section.options.filter(passes) }))
      : sections
  );
  const layout = $derived(layoutRows(shownOptions, shownSections, optionKey));
  const isEmpty = $derived(isSearching && layout.options.length === 0);
  const options = $derived(layout.options);
  // Opens at the pick — or at its section's heading, when the pick heads
  // the section, so the heading is not scrolled just out of view.
  const opensAt = $derived.by(() => {
    const row = layout.rowOf[list.tabStop] ?? -1;
    return row > 0 && layout.rows[row - 1]?.kind === 'title' ? row - 1 : row;
  });

  const isMultiple = $derived(selectionType === 'multiple');
  const isAction = $derived(selectionType === 'none');
  const uid = $props.id();
  const lineText = $derived(
    pickHintText({ validationState, helpText, errorText })
  );
  const classes = $derived(
    typeof customClasses === 'function'
      ? customClasses({ hasSections: Boolean(sections) })
      : (customClasses ?? resolveOptionList(style.current))
  );
  const sectionClasses = $derived(
    (classes.section ?? resolveOptionList({}).section!).virtual
  );
  // svelte-ignore state_referenced_locally
  const list = createOptionList<T, OptionListShared>({
    id: uid,
    options: () => options,
    value: () => value,
    onValue: (next) => {
      value = next;
    },
    onChange: (next) => onChange?.({ name, value: next }),
    isMultiple: () => isMultiple,
    isAction: () => isAction,
    onPick: (option) => onChange?.({ name, value: option }),
    compare,
    isOptionDisabled,
    optionText,
    isDeselectable: () => isDeselectable,
    name: () => name,
    isRequired: () => isRequired,
    isDisabled: () => isDisabled,
    validationState: () => validationState,
    hint: () => lineText,
    shared: () => ({ classes, testID }),
  });
  provideOptionList(list);

  const hint = $derived(list.hint);
</script>

<div
  class={cx(
    classes.root,
    classes.virtual.root,
    isDisabled && classes.disabled,
    className
  )}
  role={isMultiple || isAction ? 'group' : 'radiogroup'}
  aria-label={label ? undefined : accessibilityLabel}
  aria-labelledby={label ? list.labelId : undefined}
  aria-required={isRequired && !isMultiple && !isAction ? 'true' : undefined}
  aria-invalid={list.isInvalid && !isMultiple && !isAction ? 'true' : undefined}
  aria-describedby={hint.text ? list.hintId : undefined}
  data-testid={testID}
  onpointerdown={list.handlePointerDown}
>
  {#if label}
    <FieldLabel
      id={list.labelId}
      text={label}
    />
  {/if}
  <!-- Opens at the pick, so a long list shows what is chosen, not its top. -->
  <VirtualWindow
    keys={layout.keys}
    reveal={list.isKeyboardFocused ? (layout.rowOf[list.activeIndex] ?? -1) : -1}
    startAt={opensAt}
    class={cx(classes.virtual.viewport, isEmpty && 'hidden')}
    contentClass={classes.virtual.options}
  >
    {#snippet children(range)}
      {@const span = optionSpan(layout.rows, range.start, range.end)}
      {@const stop = list.stopWithin(span.start, span.end)}
      {#each layout.rows.slice(range.start, range.end) as row (row.key)}
        {#if row.kind === 'title'}
          <div class={sectionClasses.title[row.isFirst ? 'first' : 'rest']}>{row.title}</div>
        {:else if row.frame && sectionClasses.rowFrame[row.frame]}
          <div class={sectionClasses.rowFrame[row.frame]}>
            <VirtualOptionRow option={row.option} index={row.index} isTabStop={row.index === stop}>
              {@render rowContent(row.option, row.index)}
            </VirtualOptionRow>
          </div>
        {:else}
          <VirtualOptionRow option={row.option} index={row.index} isTabStop={row.index === stop}>
            {@render rowContent(row.option, row.index)}
          </VirtualOptionRow>
        {/if}
      {/each}
    {/snippet}
  </VirtualWindow>
  {#if empty}
    <!-- Always mounted, so a search that empties the list is announced. -->
    <div role="status" data-testid={testID ? `${testID}-empty` : undefined}>
      {#if isEmpty}{@render empty({ query })}{/if}
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

{#snippet rowContent(option: T, index: number)}
  {@render children(option, list.stateOf(option, index))}
{/snippet}
