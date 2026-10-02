import {
  createChoiceList,
  type ChoiceEntry,
} from '../base/choice-list.svelte';
import { createFieldShell } from '../form/field.svelte';
import type {
  ChoiceValidationState,
  FieldHint,
  HintContent,
} from '../form/hint';
import type { RadioGroupContext } from './context';

/** A choice is made or missing: there is no success state to show. */
export type RadioGroupValidationState = ChoiceValidationState;

/** Where the picked Radio sits among the group's Radios, in document order. */
export interface RadioGroupPick {
  /** -1 while nothing is picked. */
  index: number;
  count: number;
}

export interface RadioGroupOptions<Shared> {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  name: () => string | undefined;
  value: () => string | undefined;
  /** The bindable write: every accepted value, user pick or not. */
  onValue: (value: string | undefined) => void;
  /** A user pick changed the value. */
  onChange?: (value: string) => void;
  isDisabled: () => boolean;
  isRequired: () => boolean;
  validationState: () => RadioGroupValidationState | undefined;
  hint: () => HintContent | undefined;
  /** What the Radios read besides state: the library's business. */
  shared: () => Shared;
}

export interface RadioGroup<Shared> extends RadioGroupContext<Shared> {
  readonly picked: string | undefined;
  readonly pick: RadioGroupPick;
  /** The one line under the options and the state it puts the group in. */
  readonly hint: FieldHint;
  readonly labelId: string;
  readonly hintId: string;
}

// The field's value as a radio's: one string, or nothing picked.
const asPick = (value: unknown): string | undefined =>
  value === null || value === undefined || value === '' ? undefined : String(value);

/**
 * The radio group behaviour: the headless choice list (`base/choice-list`)
 * as native radios — one form field, one value, however many radios,
 * registered and read back in document order. A pick is never cleared, and
 * the keys are the platform's (a radio group picks as the arrows move).
 * Call during component initialisation; the component provides the result
 * to its Radios (`provideRadioGroup`) and draws from it.
 */
export function createRadioGroup<Shared>(
  options: RadioGroupOptions<Shared>
): RadioGroup<Shared> {
  // The form reveals the picked radio, else the first enabled one.
  const shell = createFieldShell({
    id: options.id,
    kind: 'radio',
    props: () => ({
      name: options.name(),
      value: options.value(),
      required: options.isRequired(),
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(asPick(next)),
    line: () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    handle: () => choices.elementAt(choices.tabStop()),
  });
  const choices = createChoiceList<string>(shell.field, {
    disabled: options.isDisabled,
  });
  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);

  const picked = $derived(asPick(shell.field.record.value));
  const pick: RadioGroupPick = $derived({
    index: picked === undefined ? -1 : choices.items().indexOf(picked),
    count: choices.items().length,
  });

  return {
    get name() {
      return options.name() ?? options.id;
    },
    get picked() {
      return picked;
    },
    get pick() {
      return pick;
    },
    get hint() {
      return shell.hint;
    },
    get isDisabled() {
      return options.isDisabled();
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    get shared() {
      return options.shared();
    },
    labelId: shell.labelId,
    hintId: shell.hintId,
    isSelected: (candidate) => picked === candidate,
    select(next, event) {
      return shell.edit(
        (onValue) =>
          choices.toggle(next, choices.items().indexOf(next), onValue),
        (stored) => {
          options.onValue(String(stored));
          options.onChange?.(String(stored));
        },
        event
      );
    },
    register: (entry: ChoiceEntry<string>) => choices.register(entry),
    reorder: choices.reorder,
    indexOf: choices.indexOf,
  };
}
