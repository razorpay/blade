import { createChoiceList } from '../base/choice-list.svelte';
import { createFieldShell } from '../form/field.svelte';
import type { ChoiceValidationState, FieldHint, HintContent } from '../form/hint';
import type { ChipGroupContext } from './context';

/** A chip is picked or not: there is no success state to show. */
export type ChipGroupValidationState = ChoiceValidationState;

export interface ChipGroupOptions<Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  /** One value (`single`) or an array of them (`multiple`). */
  value: () => string | readonly string[] | null | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: string | readonly string[] | null) => void;
  /** A user pick changed the value. */
  onChange?: (value: string | readonly string[] | null) => void;
  isMultiple: () => boolean;
  name: () => string | undefined;
  isRequired: () => boolean;
  isDisabled: () => boolean;
  validationState: () => ChipGroupValidationState | undefined;
  /** The error line's text; the help text is the group's own. */
  hint: () => HintContent | undefined;
  /** Handed to every chip as is. */
  shared: () => Shared;
}

export interface ChipGroup<Shared> extends ChipGroupContext<Shared> {
  readonly labelId: string;
  readonly hintId: string;
  /** The error line and the state it puts the group in. */
  readonly hint: FieldHint;
}

/**
 * The chip group behaviour: the headless choice list (`base/choice-list`)
 * as native radios (`single`) or checkboxes (`multiple`) — one form field
 * holding the picked value or values, the chips registered in document
 * order. The keys are the platform's, as in Blade: a radio group picks as
 * the arrows move, and each checkbox is a tab stop. Call during component
 * initialisation; the component provides the result to its Chips
 * (`provideChipGroup`).
 */
export function createChipGroup<Shared>(options: ChipGroupOptions<Shared>): ChipGroup<Shared> {
  // The form reveals the picked chip, else the first enabled one.
  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    props: () => ({
      name: options.name(),
      value: options.value(),
      required: options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(next as string | readonly string[] | null),
    line: () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    handle: () => choices.elementAt(choices.tabStop()),
  });
  const choices = createChoiceList<string>(shell.field, {
    multiple: options.isMultiple,
    disabled: options.isDisabled,
  });
  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);

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
    get isDisabled() {
      return options.isDisabled();
    },
    get isRequired() {
      return options.isRequired();
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    labelId: shell.labelId,
    hintId: shell.hintId,
    get hint() {
      return shell.hint;
    },
    register: choices.register,
    reorder: choices.reorder,
    indexOf: choices.indexOf,
    isSelected: (value) => choices.isSelected(value),
    toggle(value, index, event) {
      return shell.edit(
        (onValue) => choices.toggle(value, index, onValue),
        (next) => {
          const stored = next as string | readonly string[] | null;
          options.onValue(stored);
          options.onChange?.(stored);
        },
        event,
      );
    },
  };
}
