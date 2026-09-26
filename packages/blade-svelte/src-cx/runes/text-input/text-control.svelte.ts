import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { setupField, type FieldModel } from '../form/field.svelte';
import type { FormModel } from '../form/types';
import type { InputGroupContext } from '../input-group/context';
import type { InputGroupSpan } from '../input-group/layout';
import { caretAfterFormat } from './caret';

export interface AcceptResult {
  /** What the control must display: the accepted value, formatted. */
  display: string;
  /**
   * Caret position to restore after writing `display`; null = leave the
   * caret where the platform put it. Only set when `rewrite` is true.
   */
  caret: number | null;
  /** The control's text differs from `display`; the anatomy must write it back. */
  rewrite: boolean;
}

export interface InputModel {
  /**
   * One user edit: raw control text + caret in, the field pipeline runs
   * (parse → compare → store → notify), and the anatomy gets back what to
   * write. `onValue` fires only when the parsed value actually changed.
   */
  accept(
    raw: string,
    selectionStart: number | null,
    onValue?: (value: unknown) => void
  ): AcceptResult;
  /**
   * Focus left the control. `touched` is false exactly once for an
   * auto-focused field — programmatic focus is not a user visit, so the
   * first blur must not surface validation errors.
   */
  leave(): { touched: boolean };
}

/**
 * The text-control model over a form field: the reformat-and-caret decision
 * for every edit, and the auto-focus blur rule. Everything platform-specific
 * (writing the handle, textarea autosize, scroll-into-view) stays in the
 * rune below.
 */
export function createInput(
  field: FieldModel,
  options: { autoFocus?: boolean } = {}
): InputModel {
  let pendingAutoFocusBlur = Boolean(options.autoFocus);

  function formatValue(value: unknown): unknown {
    const { format } = field.record;
    return format ? format(value) : value;
  }

  return {
    accept(raw, selectionStart, onValue) {
      const caret = caretAfterFormat(
        raw,
        selectionStart,
        field.record.parse,
        formatValue
      );
      field.updateValue(raw, onValue);
      const display = field.record.getDisplayValue?.() ?? '';
      const rewrite = raw !== display;
      return { display, caret: rewrite ? caret : null, rewrite };
    },
    leave() {
      if (pendingAutoFocusBlur) {
        pendingAutoFocusBlur = false;
        return { touched: false };
      }
      field.touch();
      return { touched: true };
    },
  };
}

type ControlElement = HTMLInputElement | HTMLTextAreaElement;

export interface TextControlOptions {
  /** The field props; read again on every change. */
  props: () => Record<string, unknown>;
  /** Fixed at mount. */
  autoFocus: () => boolean;
  /** Every accepted value, user edit or not — the bindable write. */
  onValue: (value: unknown) => void;
  /** A user edit changed the value. */
  onChange: (value: unknown) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  /** Inside an InputGroup: the group, and this field's share of its row. */
  group?: InputGroupContext;
  span?: () => InputGroupSpan;
}

export interface TextControl {
  field: FieldModel;
  form: FormModel | undefined;
  /** What the control shows: the field value, formatted. */
  display: () => string;
  readonly isFocused: boolean;
  handleInput: (event: Event) => void;
  handleFocus: (event: FocusEvent) => void;
  /** Focus left the control. */
  handleBlur: (event: FocusEvent) => void;
  /** For a host that moves focus itself (an error, a step change). */
  focus: () => void;
  /** On the control: the field's element, and the autofocus on mount. */
  readonly attach: Attachment<ControlElement>;
}

/**
 * The behaviour the text-entry components share (TextInput, TextAreaInput):
 * field registration, the input model's accept/rewrite/caret cycle, the
 * blur rule and the control kept in step with the field. Call during
 * component initialisation.
 */
export function createTextControl(options: TextControlOptions): TextControl {
  let node: ControlElement | undefined;
  const autoFocus = options.autoFocus();
  let isFocused = $state(false);

  const { field, form, notifyInput, blur } = setupField(
    options.props(),
    'text',
    options.onValue
  );
  field.setHandle(() => node);
  const inputModel = createInput(field, { autoFocus });

  if (options.group && options.span) {
    const span = options.span;
    onDestroy(options.group.register(field.record, () => span()));
  }

  const display = (): string => field.record.getDisplayValue?.() ?? '';

  // Pre-effect: the first run lands before the template reads `display()`,
  // so the first paint is already formatted; later runs keep the field in
  // step with prop changes and write the control when `value` changed from
  // the outside (a user edit is already on the control).
  $effect.pre(() => {
    field.updateProps(options.props());
    const shown = display();
    if (node && node.value !== shown) {
      node.value = shown;
    }
  });

  return {
    field,
    form,
    display,
    get isFocused() {
      return isFocused;
    },
    handleInput(event) {
      const target = event.target as ControlElement;
      const accepted = inputModel.accept(
        target.value,
        target.selectionStart,
        (next) => {
          options.onValue(next);
          options.onChange(next);
        }
      );
      notifyInput(event);
      if (accepted.rewrite) {
        target.value = accepted.display;
        if (accepted.caret !== null) {
          try {
            target.selectionStart = target.selectionEnd = accepted.caret;
          } catch (e) {
            // Some input types (email, number) forbid selection access.
          }
        }
      }
    },
    handleFocus(event) {
      isFocused = true;
      options.onFocus?.(event);
    },
    handleBlur(event) {
      isFocused = false;
      inputModel.leave();
      blur();
      options.onBlur?.(event);
    },
    focus() {
      node?.focus();
    },
    attach(element) {
      node = element;
      if (autoFocus) {
        // Inside a surface that is still at its closed position (translated
        // off its host) a scrolling focus would drag the page after it.
        element.focus({ preventScroll: true });
      }
      return () => {
        node = undefined;
      };
    },
  };
}
