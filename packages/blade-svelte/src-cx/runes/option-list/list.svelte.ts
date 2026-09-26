import {
  createNavigableList,
  type KeyModifiers,
} from '../base/navigable-list.svelte';
import { nativeOptionState } from '../base/option-list';
import { sameSelection, type Compare } from '../base/selection';
import { setupField, type FieldModel } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleFieldError,
  type FieldHint,
  type ValidationState,
} from '../form/hint';

export interface OptionChoiceOptions<T> {
  /** The options in order; what the keyboard walks. */
  items?: () => readonly T[];
  /** Enables typeahead: the text a typed prefix is matched against. */
  typeahead?: (option: T) => string;
  /** The value is an array of picks instead of one pick or null. */
  multiple?: () => boolean;
  compare?: Compare<T>;
  isOptionDisabled?: (option: T, index: number) => boolean;
  /** Single choice: picking the picked option clears it. */
  deselectable?: () => boolean;
  disabled?: () => boolean;
}

export interface OptionChoiceModel<T> {
  /**
   * One user pick on a row. The field pipeline runs and the field counts as
   * visited — a change is the visit. Returns whether the option is picked
   * afterwards, which is what its control must show; it differs from what
   * the platform toggled when the pick was refused (disabled, or a single
   * choice that may not be cleared), and the anatomy writes it back.
   */
  toggle(option: T, index: number, onValue?: (value: unknown) => void): boolean;
  /** Reads the field's value: tracked by whatever reads it. */
  isSelected(option: T): boolean;
  isDisabled(option: T, index: number): boolean;
  /** Attributes a native row carries; see `nativeOptionState`. */
  optionState(option: T, index: number): Record<string, string>;
  /** The row the keyboard is on; -1 before the list was entered. Tracked. */
  activeIndex(): number;
  /** Focus landed on a row (Tab, a click): the keyboard continues from it. */
  setActive(index: number): void;
  /**
   * The list's one tab stop: the active row, else the first picked row,
   * else the first enabled one.
   */
  tabStop(): number;
  /**
   * One key for every choice, single or multiple: arrows, Home, End, PageUp
   * and PageDown move the active row and pick nothing; Enter and Space pick
   * the active row exactly as a click would; a printable key is typeahead
   * when the list has a `typeahead` text. Returns whether the key was the
   * list's — the anatomy then prevents the platform default, which for
   * radios would pick as it moves and for Enter would submit the form.
   */
  handleKey(
    key: string,
    mods?: KeyModifiers,
    onValue?: (value: unknown) => void
  ): boolean;
}

const same = <T>(a: T, b: T): boolean => a === b;

/**
 * A choice among visible options over a form field — one pick or many. The
 * rows are native radios or checkboxes, which own the keyboard, so unlike
 * `createOptionListCore` there is no selection store here: the field owns
 * the value.
 */
export function createOptionChoice<T>(
  field: FieldModel,
  options: OptionChoiceOptions<T> = {}
): OptionChoiceModel<T> {
  const compare = options.compare || same;
  const items = (): readonly T[] => options.items?.() ?? [];
  const isMultiple = (): boolean => Boolean(options.multiple?.());

  function picks(): T[] {
    const value = field.record.value;
    if (Array.isArray(value)) {
      return value as T[];
    }
    return value === null || value === undefined ? [] : [value as T];
  }

  const isSelected = (option: T): boolean =>
    picks().some((pick) => compare(pick, option));
  const isDisabled = (option: T, index: number): boolean =>
    Boolean(options.disabled?.() || options.isOptionDisabled?.(option, index));

  const list = createNavigableList<T>({
    items,
    isDisabled: (option, index) => isDisabled(option, index),
    typeahead: options.typeahead,
  });

  function toggle(
    option: T,
    index: number,
    onValue?: (value: unknown) => void
  ): boolean {
    if (!isDisabled(option, index)) {
      field.updateValue(next(option), onValue);
      field.touch();
    }
    return isSelected(option);
  }

  function next(option: T): unknown {
    const picked = isSelected(option);
    if (isMultiple()) {
      return picked
        ? picks().filter((pick) => !compare(pick, option))
        : [...picks(), option];
    }
    if (picked) {
      return options.deselectable?.() ? null : field.record.value;
    }
    return option;
  }

  return {
    isSelected,
    isDisabled,
    toggle,
    activeIndex: list.activeIndex,
    setActive: list.setActive,
    tabStop() {
      if (list.activeIndex() >= 0 && list.activeIndex() < items().length) {
        return list.activeIndex();
      }
      const enabled = list.enabledIndices();
      const picked = enabled.find((index) => isSelected(items()[index] as T));
      return picked ?? enabled[0] ?? -1;
    },
    handleKey(key, mods, onValue) {
      const action = list.keyAction(key, mods);
      if (!action || action === 'open' || action === 'close') {
        return false;
      }
      if (action === 'type') {
        list.type(key);
        return true;
      }
      if (action === 'select') {
        const option = list.active();
        if (option === undefined) {
          return false;
        }
        toggle(option, list.activeIndex(), onValue);
        return true;
      }
      list.move(action);
      return true;
    },
    optionState: (option, index) =>
      nativeOptionState(isSelected(option), isDisabled(option, index)),
  };
}

/** A pick is made or missing: there is no success state to show. */
export type OptionListValidationState = Exclude<ValidationState, 'success'>;

/** What a row learns about its option. */
export interface OptionState {
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface OptionListOptions<T> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  options: () => readonly T[];
  value: () => T | readonly T[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: T | readonly T[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: T | readonly T[] | null) => void;
  isMultiple: () => boolean;
  /** Defaults to identity; pass it when options are rebuilt objects. */
  compare?: (a: T, b: T) => boolean;
  isOptionDisabled?: (option: T, index: number) => boolean;
  /** Enables typeahead: the text a typed prefix is matched against. Fixed at mount. */
  optionText?: (option: T) => string;
  isDeselectable: () => boolean;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => OptionListValidationState | undefined;
  hint: () => string | undefined;
}

export interface OptionList<T> {
  /** Radios share it: the prop, else the id. */
  readonly name: string;
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
  stateOf(option: T, index: number): OptionState;
  /** The one tab stop among the mounted rows `start` to `end - 1`. */
  stopWithin(start: number, end: number): number;
  /** A row's pick. Returns whether the option is picked afterwards. */
  toggle(option: T, index: number, event: Event): boolean;
  /** Focus landed on a row (Tab, a click): the keyboard continues from it. */
  setActive(index: number): void;
  handleKeyDown(event: KeyboardEvent): void;
  handlePointerDown(): void;
  handleFocusIn(): void;
  handleFocusOut(): void;
}

/**
 * The option list behaviour: one form field holding one pick or an array
 * of them, the keyboard over the rows, and the one tab stop. Call during
 * component initialisation.
 */
export function createOptionList<T>(
  options: OptionListOptions<T>
): OptionList<T> {
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
  const model = createOptionChoice<T>(field, {
    items: options.options,
    typeahead: optionText && ((option) => optionText(option) ?? ''),
    multiple: options.isMultiple,
    compare: sameOption,
    isOptionDisabled: (option, index) =>
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

  function commit(next: unknown) {
    const value = next as T | readonly T[] | null;
    options.onValue(value);
    options.onChange?.(value);
  }

  return {
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
    stateOf(option, index) {
      return {
        index,
        isSelected: model.isSelected(option),
        isDisabled: model.isDisabled(option, index),
      };
    },
    // Single choice rows are native radios of one group, and the browser
    // tabs into a group at its checked member only (or anywhere when none
    // is checked): so while the pick is mounted it must hold the stop, or
    // Tab skips the list. Otherwise the model's stop (the active row) when
    // it is mounted — a virtual list mounts a slice — else the first
    // enabled row in view, so the keyboard continues from where the user
    // is looking.
    stopWithin(start, end) {
      const items = options.options();
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
    },
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
