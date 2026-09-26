import {
  createNavigableList,
  type KeyModifiers,
  type ListAction,
  type MoveAction,
  type NavigableListModel,
  type NavigableListOptions,
} from './navigable-list.svelte';
import { createSelection, type Compare } from './selection';

/**
 * Attributes a native option container carries: `checked` drives the
 * `checked:` style variants and `disabled` the pressed state, both read by
 * the bridge as plain attributes.
 */
export function nativeOptionState(
  active: boolean,
  disabled: boolean
): Record<string, string> {
  const state: Record<string, string> = {};
  if (active) {
    state.checked = 'true';
  }
  if (disabled) {
    state.disabled = 'true';
  }
  return state;
}

export interface OptionListCoreOptions<T> extends NavigableListOptions<T> {
  compare?: Compare<T>;
  /** Keep one option always selected: clicking the selected option does not clear it. */
  strictOption?: boolean;
  /** Host-owned value (the anatomy's `value` prop). Returning `undefined` means uncontrolled. */
  value?: () => T | null | undefined;
  defaultValue?: T | null;
  onChange?: (value: T | null) => void;
}

/** What a key dispatcher drives: the shared surface of option-list and tabs. */
export interface KeyDispatchTarget {
  keyAction(key: string, mods?: KeyModifiers): ListAction | null;
  selectActive(): void;
  type(char: string): void;
  move(action: MoveAction): void;
}

/**
 * The one key → method dispatch for list-shaped models. `open`/`close` are
 * returned untouched: only a disclosure owner can act on them.
 */
export function dispatchListKey(
  target: KeyDispatchTarget,
  key: string,
  mods?: KeyModifiers
): ListAction | null {
  const action = target.keyAction(key, mods);
  switch (action) {
    case 'select':
      target.selectActive();
      break;
    case 'type':
      target.type(key);
      break;
    case 'open':
    case 'close':
    case null:
      break;
    default:
      target.move(action);
  }
  return action;
}

export interface OptionListCore<T> extends NavigableListModel<T> {
  selected(): T | null;
  selectedIndex(): number;
  isSelected(option: T): boolean;
  /** A click on an option: toggles per `strictOption`, ignored when the option is disabled. */
  select(option: T): void;
  selectActive(): void;
  /** Applies a key: moves, selects or types. Returns the action taken so the anatomy can cancel the event. */
  handleKey(key: string, mods?: KeyModifiers): ListAction | null;
  optionState(option: T, index: number): Record<string, string>;
}

/**
 * A keyboard-navigable, single-selection list: navigation from `navigableList`,
 * the value from `selection`. Menu and tabs derive from it; the OptionList
 * component is `createOptionChoice` over a form field instead.
 */
export function createOptionListCore<T>(
  options: OptionListCoreOptions<T>
): OptionListCore<T> {
  const compare = options.compare || ((a: T, b: T) => a === b);
  const list = createNavigableList<T>(options);
  const picked = createSelection<T>({
    mode: 'single',
    allowDeselect: !options.strictOption,
    compare,
    value: () => {
      const value = options.value?.();
      if (value === undefined) {
        return undefined;
      }
      return value === null ? [] : [value];
    },
    defaultValue:
      options.defaultValue === undefined || options.defaultValue === null
        ? []
        : [options.defaultValue],
    onChange: (values) => options.onChange?.(values[0] ?? null),
  });

  function indexOf(option: T): number {
    return options.items().findIndex((item) => compare(item, option));
  }

  function isDisabled(option: T, index: number): boolean {
    return Boolean(options.isDisabled?.(option, index));
  }

  const model: OptionListCore<T> = {
    ...list,
    selected: picked.single,
    selectedIndex() {
      const value = picked.single();
      return value === null ? -1 : indexOf(value);
    },
    isSelected: picked.isSelected,
    select(option) {
      const index = indexOf(option);
      // Judge the list's own item: the caller may pass a bare value.
      if (index >= 0 && isDisabled(options.items()[index], index)) {
        return;
      }
      // Activate first: toggling may close a disclosure around this list
      // (close-on-select), whose close clears the active item — activating
      // after would resurrect it.
      list.setActive(index);
      picked.toggle(option);
    },
    selectActive() {
      const active = list.active();
      if (active !== undefined) {
        model.select(active);
      }
    },
    handleKey(key, mods) {
      return dispatchListKey(model, key, mods);
    },
    optionState: (option, index) =>
      nativeOptionState(picked.isSelected(option), isDisabled(option, index)),
  };
  return model;
}
