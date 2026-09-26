import { setupField, type FieldModel } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleFieldError,
  type FieldHint,
  type ValidationState,
} from '../form/hint';
import type { RadioGroupContext } from './context';

export interface RadioGroupModel {
  /**
   * One user pick. The field pipeline runs (parse → compare → store →
   * notify) and the field counts as visited — a radio has no meaningful
   * blur, so a change is the visit. Returns whether the pick held; when it
   * was refused the anatomy writes the control's `checked` back.
   */
  select(value: string, onValue?: (value: unknown) => void): boolean;
  isSelected(value: string): boolean;
  /** Tracked by whatever reads it. */
  value(): string | undefined;
}

/**
 * The radio group model over a form field: one field, one value, however
 * many radios. The platform suppresses picks on a disabled control,
 * synthetic dispatch does not — the gate here mirrors the platform.
 */
export function createRadioGroupModel(
  field: FieldModel,
  options: { disabled?: () => boolean } = {}
): RadioGroupModel {
  const value = (): string | undefined => {
    const current = field.record.value;
    return current === null || current === undefined || current === ''
      ? undefined
      : String(current);
  };

  return {
    value,
    isSelected: (candidate) => value() === candidate,
    select(next, onValue) {
      if (options.disabled?.()) {
        return false;
      }
      field.updateValue(next, onValue);
      field.touch();
      return value() === next;
    },
  };
}

/** A choice is made or missing: there is no success state to show. */
export type RadioGroupValidationState = Exclude<ValidationState, 'success'>;

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
  hint: () => string | undefined;
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

// Node.DOCUMENT_POSITION_PRECEDING, spelled out: there is no `Node` on native.
const PRECEDING = 2;

/**
 * The radio group behaviour: one form field, one value, however many
 * radios, registered in mount order and read back in document order. Call
 * during component initialisation; the component provides the result to
 * its Radios (`provideRadioGroup`) and draws from it.
 */
export function createRadioGroup<Shared>(
  options: RadioGroupOptions<Shared>
): RadioGroup<Shared> {
  const fieldProps = () => ({
    name: options.name(),
    value: options.value(),
    required: options.isRequired(),
    disabled: options.isDisabled(),
  });

  const { field, form, notifyInput } = setupField(
    fieldProps(),
    'radio',
    (next) => {
      options.onValue(
        next === null || next === undefined ? undefined : String(next)
      );
    }
  );
  const model = createRadioGroupModel(field, { disabled: options.isDisabled });

  // In order of mount; the form reveals the picked radio, else the first.
  const radios: Array<{
    value: string;
    getElement: () => HTMLElement | undefined;
  }> = [];
  // `radios` is a plain array: this is what tells `pick` it changed.
  let registrations = $state(0);
  field.setHandle(() =>
    (
      radios.find((radio) => model.isSelected(radio.value)) ?? radios[0]
    )?.getElement()
  );

  const picked = $derived(model.value());

  $effect.pre(() => {
    field.updateProps(fieldProps());
  });

  const line = createFieldLine(
    form,
    () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    (state) => visibleFieldError(field.record, state)
  );

  // Document order, not mount order: a Radio mounted later may sit before an
  // earlier one. Native has no `compareDocumentPosition`; mount order it is.
  const pick: RadioGroupPick = $derived.by(() => {
    void registrations;
    const ordered = radios
      .map((radio) => ({ value: radio.value, element: radio.getElement() }))
      .sort((a, b) =>
        a.element?.compareDocumentPosition && b.element
          ? a.element.compareDocumentPosition(b.element) & PRECEDING
            ? 1
            : -1
          : 0
      );
    return {
      index: ordered.findIndex((radio) => radio.value === picked),
      count: ordered.length,
    };
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
      return line.hint;
    },
    get isDisabled() {
      return options.isDisabled();
    },
    get isInvalid() {
      return line.hint.validationState === 'error';
    },
    get shared() {
      return options.shared();
    },
    labelId: `${options.id}-label`,
    hintId: `${options.id}-hint`,
    isSelected: (candidate) => picked === candidate,
    select(next, event) {
      const held = model.select(next, (stored) => {
        options.onValue(String(stored));
        options.onChange?.(String(stored));
      });
      if (held) {
        notifyInput(event);
      }
      return held;
    },
    register(radioValue, getElement) {
      const entry = { value: radioValue, getElement };
      radios.push(entry);
      registrations += 1;
      return () => {
        radios.splice(radios.indexOf(entry), 1);
        registrations += 1;
      };
    },
  };
}
