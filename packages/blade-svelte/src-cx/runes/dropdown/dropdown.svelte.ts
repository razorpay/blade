import { heldSelection } from '../base/choice-list.svelte';
import { sameItem, sameSelection } from '../base/selection';
import { createFieldShell } from '../form/field.svelte';
import type { FieldHint, HintContent, ValidationState } from '../form/hint';
import { createPopupList } from '../popup-list/popup-list.svelte';
import type { PopupList } from '../popup-list/popup-list.svelte';
import type { DropdownContext, DropdownEntry } from './context';

export interface DropdownOptions<T, Shared> {
  /** The host's `$props.id()`: the panel, label and hint ids hang off it. */
  id: string;
  value: () => T | readonly T[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: T | readonly T[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: T | readonly T[] | null) => void;
  isMultiple: () => boolean;
  /** Defaults to identity; pass it when values are rebuilt objects. */
  compare?: (a: T, b: T) => boolean;
  /** Single choice: picking the pick clears it. */
  isDeselectable: () => boolean;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => ValidationState | undefined;
  hint: () => HintContent | undefined;
  /** The host's open state (a `bind:isOpen`). */
  isOpen: () => boolean | undefined;
  onOpenValue: (isOpen: boolean) => void;
  onOpenChange?: (isOpen: boolean) => void;
  /** Handed to every item as is. */
  shared: () => Shared;
  /** No trigger of its own: the select field. */
  isSelectField: () => boolean;
}

export interface Dropdown<T, Shared>
  extends DropdownContext<T, Shared>,
    Omit<PopupList<DropdownEntry<T>>, 'pick' | 'hover' | 'activeBy' | 'register' | 'reorder'> {
  readonly panelId: string;
  readonly listId: string;
  readonly labelId: string;
  readonly hintId: string;
  /** The one line under the trigger and the state it puts the field in. */
  readonly hint: FieldHint;
  readonly isInvalid: boolean;
  /** The picked rows' texts, in list order: what a select trigger shows. */
  readonly selectedTexts: readonly string[];
  /** A search hides every row. */
  readonly hasNoResults: boolean;
}

/**
 * A dropdown: the popup list (`createPopupList`) whose rows hold a value —
 * one pick or many, kept in a form field. A single pick closes it; with
 * multiple it stays open for more, as in Blade. Opening lands on the pick.
 * Call during component initialisation; the component provides the result
 * to its items and parts (`provideDropdown`).
 */
export function createDropdown<T, Shared>(options: DropdownOptions<T, Shared>): Dropdown<T, Shared> {
  const sameValue = (a: T, b: T): boolean => (options.compare ?? sameItem)(a, b);
  const panelId = `${options.id}-panel`;
  const listId = `${options.id}-list`;

  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    props: () => ({
      name: options.name(),
      value: options.value(),
      compare: sameSelection<T>(sameValue),
      required: options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(next as T | readonly T[] | null),
    line: () => ({ validationState: options.validationState(), hint: options.hint() }),
    // The form reveals the field at its trigger.
    handle: () => list.anchor?.querySelector<HTMLElement>('button, [tabindex]') ?? list.anchor,
  });
  $effect.pre(shell.syncProps);

  const selection = heldSelection<T>(shell.field, {
    multiple: options.isMultiple,
    compare: sameValue,
    deselectable: options.isDeselectable,
  });

  let query = $state('');

  const list = createPopupList<DropdownEntry<T>>({
    // The trigger controls the listbox (a combobox's popup), not the panel.
    id: listId,
    panelId,
    haspopup: 'listbox',
    isOpen: options.isOpen,
    onValue: options.onOpenValue,
    onOpenChange: (open) => {
      // A search is for one visit.
      if (!open) {
        query = '';
      }
      options.onOpenChange?.(open);
    },
    // A link row always closes: it's a navigation, not a pick.
    closesOnPick: (entry) => Boolean(entry.isLink?.()) || !options.isMultiple(),
    // The item's own pick (its onClick, or following its link) ran; now the
    // value is held — a link row holds none.
    onPick: (entry) => {
      if (!entry.isLink?.()) {
        pickValue(entry.value());
      }
    },
    landOn: (shown) => shown.findIndex((entry) => selection.isSelected(entry.value())),
  });

  function commit(next: unknown): void {
    const value = next as T | readonly T[] | null;
    options.onValue(value);
    options.onChange?.(value);
  }

  // A row's pick goes through the field: the form hears it, and `onChange`.
  function pickValue(value: T): void {
    if (options.isDisabled()) {
      return;
    }
    shell.edit(
      (onValue) => {
        shell.field.updateValue(selection.next(value), onValue);
        shell.field.touch();
      },
      commit,
    );
  }

  const selectedTexts = $derived(
    list.registered.filter((entry) => selection.isSelected(entry.value())).map((entry) => entry.text()),
  );

  // Getters stay getters: copied as descriptors, not read once.
  return Object.defineProperties(list, Object.getOwnPropertyDescriptors({
    panelId,
    listId,
    labelId: shell.labelId,
    hintId: shell.hintId,
    get hint() {
      return shell.hint;
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    get shared() {
      return options.shared();
    },
    get isMultiple() {
      return options.isMultiple();
    },
    get isSelectField() {
      return options.isSelectField();
    },
    isSelected: (value: T) => selection.isSelected(value),
    get query() {
      return query;
    },
    setQuery(next: string) {
      query = next;
      // The rows re-filter on the next read: land on the first match then.
      queueMicrotask(() => list.move('first'));
    },
    matches(text: string) {
      return !query || text.toLowerCase().includes(query.trim().toLowerCase());
    },
    get selectedTexts() {
      return selectedTexts;
    },
    get hasNoResults() {
      return Boolean(query) && list.registered.length > 0 && list.shown.length === 0;
    },
  })) as unknown as Dropdown<T, Shared>;
}
