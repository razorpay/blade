import { createChoiceList, type ChoiceEntry } from '../base/choice-list.svelte';
import { sameSelection } from '../base/selection';
import { setupField } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleFieldError,
  type FieldHint,
  type ValidationState,
} from '../form/hint';
import type { OptionListContext } from './context';

/** A pick is made or missing: there is no success state to show. */
export type OptionListValidationState = Exclude<ValidationState, 'success'>;

export interface OptionListOptions<T, Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  /**
   * The options as data (a virtual list). Without it the options are the
   * OptionItems that register inside the list, in document order.
   */
  options?: () => readonly T[];
  value: () => T | readonly T[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: T | readonly T[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: T | readonly T[] | null) => void;
  isMultiple: () => boolean;
  /** Defaults to identity; pass it when options are rebuilt objects. */
  compare?: (a: T, b: T) => boolean;
  /** Data only: registered items say it themselves. */
  isOptionDisabled?: (option: T, index: number) => boolean;
  /**
   * Data only: enables typeahead, the text a typed prefix is matched
   * against. Fixed at mount. Registered items match their text.
   */
  optionText?: (option: T) => string;
  isDeselectable: () => boolean;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => OptionListValidationState | undefined;
  hint: () => string | undefined;
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
  options: OptionListOptions<T, Shared>
): OptionList<T, Shared> {
  const sameOption = (a: T, b: T) =>
    options.compare ? options.compare(a, b) : a === b;
  // The field stores one item or an array of them.
  const sameValue = sameSelection<T>(sameOption);

  const fieldProps = () => ({
    name: options.name(),
    value: options.value(),
    compare: sameValue,
    required: options.isRequired(),
    disabled: options.isDisabled(),
  });

  const { field, form, notifyInput } = setupField(
    fieldProps(),
    'radio',
    (next) => {
      options.onValue(next as T | readonly T[] | null);
    }
  );
  const optionText = options.optionText;
  const model = createChoiceList<T>(field, {
    items: options.options,
    typeahead: optionText && ((option) => optionText(option) ?? ''),
    multiple: options.isMultiple,
    compare: sameOption,
    isItemDisabled: (option, index) =>
      Boolean(options.isOptionDisabled?.(option, index)),
    deselectable: options.isDeselectable,
    disabled: options.isDisabled,
  });

  $effect.pre(() => {
    field.updateProps(fieldProps());
  });

  // One keyboard for single and multiple: keys move the active row and
  // pick nothing; Enter and Space pick it. The ring shows only while the
  // keyboard is what is driving — a pointer press hides it until a key.
  const activeIndex = $derived(model.activeIndex());
  let byKeyboard = $state(true);
  let hasFocus = $state(false);

  const line = createFieldLine(
    form,
    () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    (state) => visibleFieldError(field.record, state)
  );

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
        if (model.isSelected(items[index] as T)) {
          return index;
        }
      }
    }
    if (tabStop >= start && tabStop < end) {
      return tabStop;
    }
    for (let index = start; index < end; index += 1) {
      if (!model.isDisabled(items[index] as T, index)) {
        return index;
      }
    }
    return start;
  }
  // Registered items are all mounted: one stop among them all.
  const stop = $derived(stopWithin(0, model.items().length));

  function commit(next: unknown) {
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
    labelId: `${options.id}-label`,
    hintId: `${options.id}-hint`,
    get hint() {
      return line.hint;
    },
    get isInvalid() {
      return line.hint.validationState === 'error';
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
    reorder: () => model.reorder(),
    indexOf: (entry) => model.indexOf(entry),
    stateOf(option, index) {
      return {
        index,
        isSelected: model.isSelected(option),
        isDisabled: model.isDisabled(option, index),
      };
    },
    isActive: (index) => hasFocus && byKeyboard && index === activeIndex,
    isTabStop: (index) => index === stop,
    stopWithin,
    toggle(option, index, event) {
      let changed = false;
      const shown = model.toggle(option, index, (next) => {
        changed = true;
        commit(next);
      });
      if (changed) {
        notifyInput(event);
      }
      return shown;
    },
    setActive: (index) => model.setActive(index),
    handleKeyDown(event) {
      let changed = false;
      const handled = model.handleKey(
        event.key,
        { alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey },
        (next) => {
          changed = true;
          commit(next);
        }
      );
      if (!handled) {
        return;
      }
      // The platform would pick a radio as it moves, toggle on Space a second
      // time, and submit the form on Enter.
      event.preventDefault();
      byKeyboard = true;
      if (changed) {
        notifyInput(event);
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
