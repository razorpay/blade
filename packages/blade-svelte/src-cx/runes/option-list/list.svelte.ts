import { createChoiceList } from '../base/choice-list.svelte';
import type { ChoiceEntry } from '../base/choice-list.svelte';
import { sameItem, sameSelection } from '../base/selection';
import { focusableWithin } from '../dom/focus';
import { createFieldShell } from '../form/field.svelte';
import type { ChoiceValidationState, FieldHint, HintContent } from '../form/hint';
import type { OptionListContext } from './context';

/** A pick is made or missing: there is no success state to show. */
export type OptionListValidationState = ChoiceValidationState;

export interface OptionListOptions<T, Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  /**
   * The items as data (a virtual list). Without it the items are the
   * OptionItems that register inside the list, in document order.
   */
  items?: () => readonly T[];
  value: () => T | readonly T[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: T | readonly T[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: T | readonly T[] | null) => void;
  isMultiple: () => boolean;
  /**
   * Rows act instead of picking (`selectionType="none"`): buttons that hold
   * nothing, with the same keyboard. A press reports through `onPick`.
   */
  isAction?: () => boolean;
  /** An action row was pressed. */
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
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => OptionListValidationState | undefined;
  hint: () => HintContent | undefined;
  /** Handed to every item as is. */
  shared: () => Shared;
}

export interface OptionList<T, Shared> extends OptionListContext<T, Shared> {
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
  /** The one tab stop among the mounted rows `start` to `end - 1`. */
  stopWithin(start: number, end: number): number;
  /** On the root: a pointer press hides the keyboard ring until a key. */
  handlePointerDown(): void;
}

/**
 * The option list behaviour: one form field holding one pick or an array
 * of them, the keyboard over the rows, and the one tab stop — the
 * headless choice list (`base/choice-list`) as native radio and checkbox
 * rows. Call during component initialisation; the component provides the
 * result to its OptionItems (`provideOptionList`).
 */
export function createOptionList<T, Shared>(
  options: OptionListOptions<T, Shared>,
): OptionList<T, Shared> {
  const sameOption = (a: T, b: T): boolean => (options.compare ?? sameItem)(a, b);
  const isAction = (): boolean => Boolean(options.isAction?.());
  // The field stores one item or an array of them.
  const sameValue = sameSelection<T>(sameOption);

  // The form reveals the picked row, else the first enabled one — when the
  // rows register; a virtual list's rows are data, and it has no handle.
  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    // Action rows are no form field: nothing to submit, nothing to require.
    props: () => ({
      name: isAction() ? undefined : options.name(),
      value: isAction() ? null : options.value(),
      compare: sameValue,
      required: !isAction() && options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(next as T | readonly T[] | null),
    line: () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    // The row is a label: the form focuses the control inside it.
    handle: () => {
      const row = model.elementAt(model.tabStop());
      return row?.querySelectorAll ? focusableWithin(row)[0] ?? row : row;
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
  });

  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);

  // One keyboard for single and multiple: keys move the active row and
  // pick nothing; Enter and Space pick it. The ring shows only while the
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
  // Registered items are all mounted: one stop among them all.
  const stop = $derived(stopWithin(0, model.items().length));

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
      return isAction() ? 'button' : options.isMultiple() ? 'checkbox' : 'radio';
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
    register: (entry: ChoiceEntry<T>) => model.register(entry),
    reorder: model.reorder,
    indexOf: model.indexOf,
    stateOf(option, index) {
      return {
        index,
        isSelected: !isAction() && model.isSelected(option),
        isDisabled: model.isDisabled(option, index),
      };
    },
    isActive: (index) => hasFocus && byKeyboard && index === activeIndex,
    isTabStop: (index) => index === stop,
    stopWithin,
    toggle(option, index, event) {
      if (isAction()) {
        if (!model.isDisabled(option, index)) {
          model.setActive(index);
          options.onPick?.(option);
        }
        return false;
      }
      return shell.edit((onValue) => model.toggle(option, index, onValue), commit, event);
    },
    setActive: (index) => model.setActive(index),
    handleKeyDown(event) {
      // An action row is a button: Enter and Space are its own click.
      if (isAction() && (event.key === 'Enter' || event.key === ' ')) {
        byKeyboard = true;
        return;
      }
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
      // The platform would pick a radio as it moves, toggle on Space a second
      // time, and submit the form on Enter.
      event.preventDefault();
      byKeyboard = true;
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
