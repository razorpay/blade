import { SvelteMap } from 'svelte/reactivity';
import { createChoiceList } from '../base/choice-list.svelte';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import { sameItem, sameSelection } from '../base/selection';
import { focusableWithin } from '../dom/focus';
import { createFieldShell } from '../form/field.svelte';
import type { ChoiceValidationState, FieldHint, HintContent } from '../form/hint';
import type { CardGroupContext } from './context';

/** A pick is made or missing: there is no success state to show. */
export type CardGroupValidationState = ChoiceValidationState;

export interface CardGroupOptions<T, Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  /**
   * The items as data: each CardGroupItem finds its place among them by its
   * value, so the list may mount only some (a virtual window) and put
   * anything between them (section headings). Without it the items are the
   * CardGroupItems that register inside the list, in document order. Fixed
   * at mount: data or registered.
   */
  items?: () => readonly T[];
  value: () => T | readonly T[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: T | readonly T[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: T | readonly T[] | null) => void;
  isMultiple: () => boolean;
  /**
   * Every user pick, by pointer or keyboard, whether it changed the value
   * or not — a list where a pick submits, picked again, still reports.
   */
  onPick?: (option: T) => void;
  /** Defaults to identity; pass it when options are rebuilt objects. */
  compare?: (a: T, b: T) => boolean;
  /** Data only: registered items say it themselves. */
  isItemDisabled?: (option: T, index: number) => boolean;
  /**
   * Data only: enables typeahead, the text a typed prefix is matched
   * against. Fixed at mount. Registered items match their text.
   */
  itemText?: (option: T) => string;
  isDeselectable: () => boolean;
  /**
   * Single choice: the arrows pick as they move, as a radio group's do
   * (`onPick` stays for clicks, Enter and Space). Off, they move the
   * keyboard and pick nothing, as a listbox's — ActionList's, where a pick
   * may submit.
   */
  selectsOnMove: () => boolean;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => CardGroupValidationState | undefined;
  hint: () => HintContent | undefined;
  /** Handed to every item as is. */
  shared: () => Shared;
}

export interface CardGroup<T, Shared> extends CardGroupContext<T, Shared> {
  readonly labelId: string;
  readonly hintId: string;
  /** The one line under the options and the state it puts the list in. */
  readonly hint: FieldHint;
  readonly isInvalid: boolean;
  /** The row the keyboard is on; -1 when none. */
  readonly activeIndex: number;
  /** The list has focus and the keyboard is what is driving: draw the ring. */
  readonly isKeyboardFocused: boolean;
  /** The model's one tab stop. */
  readonly tabStop: number;
  /** On the root: a pointer press hides the keyboard ring until a key. */
  handlePointerDown(): void;
}

/**
 * The option list behaviour: one form field holding one pick or an array
 * of them, the keyboard over the rows, and the one tab stop — the
 * headless choice list (`base/choice-list`) as native radio and checkbox
 * rows. Call during component initialisation; the component provides the
 * result to its CardGroupItems (`provideCardGroup`).
 */
export function createCardGroup<T, Shared>(
  options: CardGroupOptions<T, Shared>,
): CardGroup<T, Shared> {
  const sameOption = (a: T, b: T): boolean => (options.compare ?? sameItem)(a, b);
  // The field stores one item or an array of them.
  const sameValue = sameSelection<T>(sameOption);

  // Data rows mounted now, by their place among the items.
  const mounted = new SvelteMap<number, () => HTMLElement | undefined>();

  // The form reveals the picked row, else the first enabled one: the
  // registered row, or the mounted data row (else the first mounted one).
  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    props: () => ({
      name: options.name(),
      value: options.value(),
      compare: sameValue,
      required: options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(next as T | readonly T[] | null),
    line: () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    element: () =>
      options.items
        ? (mounted.get(model.tabStop()) ?? mounted.values().next().value)?.()
        : model.elementAt(model.tabStop()),
    // The row is a label: a reveal focuses the control inside it.
    focusTarget: () => {
      const row = shell.field.record.element();
      return row ? focusableWithin(row)[0] ?? row : row;
    },
  });
  const itemText = options.itemText;
  const model = createChoiceList<T>(shell.field, {
    items: options.items,
    typeahead: itemText && ((option) => itemText(option) ?? ''),
    multiple: options.isMultiple,
    compare: sameOption,
    isItemDisabled: (option, index) => Boolean(options.isItemDisabled?.(option, index)),
    deselectable: options.isDeselectable,
    disabled: options.isDisabled,
    followFocus: options.selectsOnMove,
  });

  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);

  // One keyboard for single and multiple: keys move the active row — and
  // pick it, for a single choice that `selectsOnMove` — and Enter and Space
  // pick it. The ring shows only while the
  // keyboard is what is driving — a pointer press hides it until a key.
  const activeIndex = $derived(model.activeIndex());
  let byKeyboard = $state(true);
  let hasFocus = $state(false);

  const tabStop = $derived(model.tabStop());

  // Single choice rows are native radios of one group, and the browser
  // tabs into a group at its checked member only (or anywhere when none
  // is checked): so while the pick is mounted it must hold the stop, or
  // Tab skips the list. Otherwise the model's stop (the active row) when
  // it is mounted — a virtual list mounts a slice — else the first
  // enabled row in view, so the keyboard continues from where the user
  // is looking.
  function stopWithin(start: number, end: number): number {
    const items = model.items();
    if (!options.isMultiple()) {
      for (let index = start; index < end; index += 1) {
        if (model.isSelected(items[index])) {
          return index;
        }
      }
    }
    if (tabStop >= start && tabStop < end) {
      return tabStop;
    }
    for (let index = start; index < end; index += 1) {
      if (!model.isDisabled(items[index], index)) {
        return index;
      }
    }
    return start;
  }
  // Registered items are all mounted: one stop among them all. Data rows
  // may be a slice (a virtual window): the stop is among the mounted span.
  const mountedSpan = $derived.by(() => {
    let start = Number.POSITIVE_INFINITY;
    let end = 0;
    for (const index of mounted.keys()) {
      start = Math.min(start, index);
      end = Math.max(end, index + 1);
    }
    // A row's place moves when the items change (a search shrinks them)
    // before it remounts: only places still among the items count.
    end = Math.min(end, model.items().length);
    return start < end ? { start, end } : { start: 0, end: 0 };
  });
  const stop = $derived(
    options.items
      ? stopWithin(mountedSpan.start, mountedSpan.end)
      : stopWithin(0, model.items().length),
  );

  // Data only: an option's place, by identity first, else by `compare`
  // (rebuilt objects).
  const placeOf = $derived.by(() => {
    const places = new Map<T, number>();
    if (options.items) {
      model.items().forEach((item, index) => {
        if (!places.has(item)) {
          places.set(item, index);
        }
      });
    }
    return places;
  });

  function commit(next: unknown): void {
    const value = next as T | readonly T[] | null;
    options.onValue(value);
    options.onChange?.(value);
  }

  return {
    get shared() {
      return options.shared();
    },
    get kind() {
      return options.isMultiple() ? 'checkbox' : 'radio';
    },
    get name() {
      return options.name() ?? options.id;
    },
    labelId: shell.labelId,
    hintId: shell.hintId,
    get hint() {
      return shell.hint;
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    get activeIndex() {
      return activeIndex;
    },
    get isKeyboardFocused() {
      return hasFocus && byKeyboard;
    },
    get tabStop() {
      return tabStop;
    },
    isData: Boolean(options.items),
    indexOfOption(option) {
      return placeOf.get(option) ?? model.items().findIndex((item) => sameOption(item, option));
    },
    mountRow(index, element) {
      mounted.set(index, element);
      return () => {
        if (mounted.get(index) === element) {
          mounted.delete(index);
        }
      };
    },
    register: (entry: ChoiceEntry<T>) => model.register(entry),
    reorder: model.reorder,
    indexOf: model.indexOf,
    stateOf(option, index) {
      return {
        index,
        isSelected: model.isSelected(option),
        isDisabled: model.isDisabled(option, index),
      };
    },
    isActive: (index) => hasFocus && byKeyboard && index === activeIndex,
    isTabStop: (index) => index === stop,
    toggle(option, index, event) {
      const isPicked = shell.edit((onValue) => model.toggle(option, index, onValue), commit, event);
      if (!model.isDisabled(option, index)) {
        options.onPick?.(option);
      }
      return isPicked;
    },
    setActive: (index) => model.setActive(index),
    handleKeyDown(event) {
      const handled = shell.edit(
        (onValue) =>
          model.handleKey(
            event.key,
            { alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey },
            onValue,
          ),
        commit,
        event,
      );
      if (!handled) {
        return;
      }
      // The platform would pick a radio as it moves (the list decides that),
      // toggle on Space a second time, and submit the form on Enter.
      event.preventDefault();
      byKeyboard = true;
      // Enter and Space picked the active row, as a click would.
      if (event.key === 'Enter' || event.key === ' ') {
        const index = model.activeIndex();
        const option = model.items()[index];
        if (index >= 0 && !model.isDisabled(option, index)) {
          options.onPick?.(option);
        }
      }
    },
    handlePointerDown() {
      byKeyboard = false;
    },
    handleFocusIn() {
      hasFocus = true;
    },
    handleFocusOut() {
      hasFocus = false;
    },
  };
}
