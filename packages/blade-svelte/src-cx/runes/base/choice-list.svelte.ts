import { createNavigableList } from './navigable-list.svelte';
import type { KeyModifiers } from './navigable-list.svelte';
import { nativeOptionState } from './option-list';
import { createOrderedEntries } from './ordered-entries.svelte';
import type { EntryHost, OrderedEntry } from './ordered-entries.svelte';
import type { Compare } from './selection';

/**
 * The field a choice list writes its value to: the form's `FieldModel`,
 * structurally, so this atom stays free of the form layer.
 */
export interface ChoiceField {
  readonly record: { readonly value: unknown };
  updateValue(value: unknown, onValue?: (value: unknown) => void): void;
  touch(): void;
}

/** One registered choice: an OptionItem, a CardGroupItem. */
export interface ChoiceEntry<T> extends OrderedEntry {
  value(): T;
  isDisabled(): boolean;
  /** What typeahead matches; the element's text when absent. */
  text?(): string | undefined;
}

export interface ChoiceListOptions<T> {
  /**
   * The choices as data, in order (a virtual list, which mounts a slice).
   * Without it the choices are the registered entries, in document order.
   */
  items?: () => readonly T[];
  /** Data only: registered entries say it themselves. */
  isItemDisabled?: (item: T, index: number) => boolean;
  /** Data only: enables typeahead. Registered entries always have it. */
  typeahead?: (item: T) => string;
  /** The value is an array of picks instead of one pick or null. */
  multiple?: () => boolean;
  compare?: Compare<T>;
  /** Single choice: picking the picked choice clears it. */
  deselectable?: () => boolean;
  /** Every choice refuses picks. */
  disabled?: () => boolean;
  /** Arrows wrap from the last choice to the first and back. */
  loop?: boolean;
  /** Which arrows move: up/down (the default), left/right, or both. */
  orientation?: 'vertical' | 'horizontal' | 'both';
}

export interface ChoiceList<T> extends EntryHost<ChoiceEntry<T>> {
  /** The choices in order: the data, or the registered entries' values. Tracked. */
  items(): readonly T[];
  /** The registered entry's element at `index`, in document order. */
  elementAt(index: number): HTMLElement | undefined;
  /**
   * One user pick. The field pipeline runs and the field counts as visited
   * — a change is the visit. Returns whether the choice is picked
   * afterwards, which is what its control must show; it differs from what
   * the platform toggled when the pick was refused (disabled, or a single
   * choice that may not be cleared), and the anatomy writes it back.
   */
  toggle(item: T, index: number, onValue?: (value: unknown) => void): boolean;
  /** Reads the field's value: tracked by whatever reads it. */
  isSelected(item: T): boolean;
  isDisabled(item: T, index: number): boolean;
  /** Attributes a native row carries; see `nativeOptionState`. */
  optionState(item: T, index: number): Record<string, string>;
  /** The choice the keyboard is on; -1 before the list was entered. Tracked. */
  activeIndex(): number;
  /** Focus landed on a choice (Tab, a click): the keyboard continues from it. */
  setActive(index: number): void;
  /**
   * The list's one tab stop: the active choice, else the first picked one,
   * else the first enabled one.
   */
  tabStop(): number;
  /**
   * One key for every choice, single or multiple: arrows, Home, End, PageUp
   * and PageDown move the active choice and pick nothing; Enter and Space
   * pick it exactly as a click would; a printable key is typeahead. Returns
   * whether the key was the list's — the anatomy then prevents the platform
   * default, which for radios would pick as it moves and for Enter would
   * submit the form.
   */
  handleKey(key: string, mods?: KeyModifiers, onValue?: (value: unknown) => void): boolean;
  /**
   * Movement keys only — for choices whose element picks on its own click
   * (a button), where Enter and Space must stay the platform's. Moves the
   * active choice and focuses its element. Returns whether the key moved.
   */
  handleMoveKey(key: string, mods?: KeyModifiers): boolean;
}

const same = <T>(a: T, b: T): boolean => a === b;

/**
 * The headless option list: choices over a form field — one pick or many
 * — with the keyboard over them. The choices are data (`items`) or entries
 * that register themselves (`register`), read back in document order, so
 * anything else may sit between them. Its anatomies: OptionList (radio and
 * checkbox rows), RadioGroup and ChipGroup (native radios and checkboxes),
 * CardGroup (expanding headers) and Tabs (a tablist).
 */
export function createChoiceList<T>(
  field: ChoiceField,
  options: ChoiceListOptions<T> = {},
): ChoiceList<T> {
  const compare = options.compare ?? same;
  const isMultiple = (): boolean => Boolean(options.multiple?.());

  const entries = createOrderedEntries<ChoiceEntry<T>>();
  const ordered = $derived(entries.ordered);
  const registered = $derived(ordered.map((entry) => entry.value()));

  const items = (): readonly T[] => options.items?.() ?? registered;

  function picks(): T[] {
    const value = field.record.value;
    if (Array.isArray(value)) {
      return value as T[];
    }
    return value === null || value === undefined ? [] : [value as T];
  }

  const isSelected = (item: T): boolean => picks().some((pick) => compare(pick, item));
  const isDisabled = (item: T, index: number): boolean => {
    if (options.disabled?.()) {
      return true;
    }
    return options.items
      ? Boolean(options.isItemDisabled?.(item, index))
      : Boolean(ordered[index]?.isDisabled());
  };

  function entryText(index: number): string {
    const entry = ordered[index];
    return entry?.text?.() ?? entry?.getElement()?.textContent?.trim() ?? '';
  }

  const list = createNavigableList<T>({
    items,
    isDisabled,
    loop: options.loop,
    orientation: options.orientation,
    typeahead: options.items ? options.typeahead : (item) => entryText(items().indexOf(item)),
  });

  function next(item: T): unknown {
    const picked = isSelected(item);
    if (isMultiple()) {
      return picked ? picks().filter((pick) => !compare(pick, item)) : [...picks(), item];
    }
    if (picked) {
      return options.deselectable?.() ? null : field.record.value;
    }
    return item;
  }

  function toggle(item: T, index: number, onValue?: (value: unknown) => void): boolean {
    if (!isDisabled(item, index)) {
      field.updateValue(next(item), onValue);
      field.touch();
    }
    return isSelected(item);
  }

  return {
    register: entries.register,
    reorder: entries.reorder,
    indexOf: entries.indexOf,
    items,
    elementAt: (index) => ordered[index]?.getElement(),
    isSelected,
    isDisabled,
    toggle,
    optionState: (item, index) => nativeOptionState(isSelected(item), isDisabled(item, index)),
    activeIndex: list.activeIndex,
    setActive: list.setActive,
    tabStop() {
      if (list.activeIndex() >= 0 && list.activeIndex() < items().length) {
        return list.activeIndex();
      }
      const enabled = list.enabledIndices();
      const picked = enabled.find((index) => isSelected(items()[index]));
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
        const item = list.active();
        if (item === undefined) {
          return false;
        }
        toggle(item, list.activeIndex(), onValue);
        return true;
      }
      list.move(action);
      return true;
    },
    handleMoveKey(key, mods) {
      const action = list.keyAction(key, mods);
      if (
        !action ||
        action === 'open' ||
        action === 'close' ||
        action === 'select' ||
        action === 'type'
      ) {
        return false;
      }
      list.move(action);
      ordered[list.activeIndex()]?.getElement()?.focus();
      return true;
    },
  };
}
