import type { Attachment } from 'svelte/attachments';
import { syncChecked } from '../dom/checked';
import { createFieldShell, type FieldModel } from '../form/field.svelte';
import type {
  ChoiceValidationState,
  FieldHint,
  HintContent,
} from '../form/hint';

export interface CheckboxModel {
  /**
   * One user toggle: `checked` is what the control now shows. The field
   * pipeline runs (parse → compare → store → notify) and the field counts
   * as visited — a checkbox has no meaningful blur, so a change is the
   * visit. Returns what the control must show; it differs from `checked`
   * when the toggle was refused, and the anatomy writes it back.
   */
  toggle(checked: boolean, onValue?: (value: unknown) => void): boolean;
  /** Tracked by whatever reads it. */
  isChecked(): boolean;
}

/**
 * The checkbox model over a form field. The platform suppresses toggles on
 * a disabled control, synthetic dispatch does not — the gate here mirrors
 * the platform.
 */
export function createCheckbox(
  field: FieldModel,
  options: { disabled?: () => boolean } = {}
): CheckboxModel {
  const isChecked = (): boolean => Boolean(field.record.value);

  return {
    isChecked,
    toggle(checked, onValue) {
      if (options.disabled?.()) {
        return isChecked();
      }
      field.updateValue(checked, onValue);
      field.touch();
      return isChecked();
    },
  };
}

/** A box is ticked or not: there is no success state to show. */
export type ToggleValidationState = ChoiceValidationState;

export interface ToggleOptions {
  /** The host's `$props.id()`: the hint id hangs off it. */
  id: string;
  name: () => string | undefined;
  isChecked: () => boolean;
  /** The bindable write: every accepted state, user toggle or not. */
  onValue: (isChecked: boolean) => void;
  /** A user toggle changed the state. */
  onChange?: (isChecked: boolean) => void;
  /** Maps the checked state to the value the form collects. */
  parse?: () => ((isChecked: boolean) => unknown) | undefined;
  isDisabled: () => boolean;
  /**
   * Refuses toggles without being `disabled`: the control keeps its place
   * in the tab order (a switch saving its setting).
   */
  isBusy?: () => boolean;
  isRequired?: () => boolean;
  validationState?: () => ToggleValidationState | undefined;
  hint?: () => HintContent | undefined;
}

export interface Toggle {
  /** What the control shows: the field's value. */
  readonly isChecked: boolean;
  readonly state: 'on' | 'off';
  readonly tone: 'default' | 'invalid';
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
  readonly hintId: string;
  handleChange(event: Event): void;
  /** On the input: writes `checked` back, and is how the form finds the element. */
  readonly sync: Attachment<HTMLInputElement>;
}

/**
 * A checkbox to the form — Checkbox and Switch are two looks of it. Call
 * during component initialisation.
 */
export function createToggle(options: ToggleOptions): Toggle {
  let node: HTMLInputElement | undefined;

  const shell = createFieldShell({
    id: options.id,
    kind: 'checkbox',
    props: () => ({
      name: options.name(),
      value: options.isChecked(),
      parse: options.parse?.(),
      required: options.isRequired?.() ?? false,
      disabled: options.isDisabled(),
    }),
    onValue: (next) => options.onValue(Boolean(next)),
    line: () => ({
      validationState: options.validationState?.(),
      hint: options.hint?.(),
    }),
    handle: () => node,
  });
  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(shell.syncProps);
  const model = createCheckbox(shell.field, {
    disabled: () => options.isDisabled() || Boolean(options.isBusy?.()),
  });

  // The control follows the field through `sync`.
  const isChecked = $derived(model.isChecked());
  const write = syncChecked(() => isChecked);

  return {
    get isChecked() {
      return isChecked;
    },
    get state() {
      return isChecked ? 'on' : 'off';
    },
    get tone() {
      return shell.isInvalid ? 'invalid' : 'default';
    },
    get hint() {
      return shell.hint;
    },
    hintId: shell.hintId,
    handleChange(event) {
      const target = event.target as HTMLInputElement;
      const shown = shell.edit(
        (onValue) => model.toggle(target.checked, onValue),
        (next) => {
          options.onValue(Boolean(next));
          options.onChange?.(Boolean(next));
        },
        event
      );
      if (target.checked !== shown) {
        target.checked = shown;
      }
    },
    sync(element) {
      node = element;
      const undo = write(element);
      return () => {
        undo?.();
        node = undefined;
      };
    },
  };
}
