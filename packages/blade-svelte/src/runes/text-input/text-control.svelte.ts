import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createFieldShell } from '../form/field.svelte';
import type { FieldModel, FieldShell } from '../form/field.svelte';
import type { HintProps } from '../form/hint';
import type { InputGroupContext } from '../input-group/context';
import type { InputGroupSpan } from '../input-group/layout';
import { caretAfterFormat } from './caret';
import { maskEdit } from './mask';

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
    onValue?: (value: unknown) => void,
  ): AcceptResult;
}

/**
 * The text-control model over a form field: the reformat-and-caret decision
 * for every edit. With a `mask` (TextInput's `format`) the edit runs through
 * the mask first, React's caret rules and all.
 */
export function createInput(
  field: FieldModel,
  options: { mask?: () => string | undefined } = {},
): InputModel {
  function formatValue(value: unknown): unknown {
    const { format } = field.record;
    return format ? format(value) : value;
  }

  return {
    accept(raw, selectionStart, onValue) {
      const pattern = options.mask?.();
      let text = raw;
      let caret: number | null;
      if (pattern) {
        const previous = field.record.getDisplayValue?.() ?? '';
        const edit = maskEdit(previous, raw, selectionStart ?? raw.length, pattern);
        text = edit.value;
        caret = edit.caret;
      } else {
        caret = caretAfterFormat(raw, selectionStart, field.record.parse, formatValue);
      }
      field.updateValue(text, onValue);
      const display = field.record.getDisplayValue?.() ?? '';
      const rewrite = raw !== display;
      return { display, caret: rewrite ? caret : null, rewrite };
    },
  };
}

type ControlElement = HTMLInputElement | HTMLTextAreaElement;

export interface TextControlOptions {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  /** The field props; read again on every change. */
  props: () => Record<string, unknown>;
  /** The host's state and line; see `createFieldLine`. */
  line: () => HintProps;
  /** TextInput's `format` pattern, if any. */
  mask?: () => string | undefined;
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

export interface TextControl extends FieldShell {
  /** What the control shows: the field value, formatted. */
  display: () => string;
  readonly isFocused: boolean;
  handleInput: (event: Event) => void;
  handleFocus: (event: FocusEvent) => void;
  /** Focus left the control. */
  handleBlur: (event: FocusEvent) => void;
  /** For a host that moves focus itself (an error, a step change). */
  focus: () => void;
  /** Empties the field as an edit would (`onChange` fires), and focuses it. */
  clear: () => void;
  /**
   * Sets a value as a user edit would: `onChange` fires and the form hears
   * it. False when the value did not change.
   */
  change: (value: unknown) => boolean;
  /** On the control: the field's element, and the autofocus on mount. */
  readonly attach: Attachment<ControlElement>;
}

/**
 * The behaviour the text-entry components share (TextInput, TextArea):
 * the field shell (registration, the line, the ids), the input model's
 * accept/rewrite/caret cycle, InputGroup membership and the control kept
 * in step with the field. Call during component initialisation.
 */
export function createTextControl(options: TextControlOptions): TextControl {
  let node: ControlElement | undefined;
  const autoFocus = options.autoFocus();
  let isFocused = $state(false);

  const shell = createFieldShell({
    id: options.id,
    kind: 'text',
    props: options.props,
    onValue: options.onValue,
    line: options.line,
    element: () => node,
  });
  const { field } = shell;
  const inputModel = createInput(field, { mask: options.mask });

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
    shell.syncProps();
    const shown = display();
    if (node && node.value !== shown) {
      node.value = shown;
    }
  });

  // A user edit: the host hears it, and the form hears it after, both only
  // when the value changed — a keystroke the format rejects reaches neither.
  function edit(raw: string, selectionStart: number | null, event?: Event): AcceptResult {
    return shell.edit(
      (onValue) => inputModel.accept(raw, selectionStart, onValue),
      (next) => {
        options.onValue(next);
        options.onChange(next);
      },
      event,
    );
  }

  return {
    ...shell,
    get hint() {
      return shell.hint;
    },
    get isInvalid() {
      return shell.isInvalid;
    },
    display,
    get isFocused() {
      return isFocused;
    },
    handleInput(event) {
      const target = event.target as ControlElement;
      const accepted = edit(target.value, target.selectionStart, event);
      if (accepted.rewrite) {
        target.value = accepted.display;
        if (accepted.caret !== null) {
          try {
            target.selectionStart = accepted.caret;
            target.selectionEnd = accepted.caret;
          } catch (e: unknown) {
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
      field.touch();
      shell.blur();
      options.onBlur?.(event);
    },
    focus() {
      node?.focus();
    },
    clear() {
      const accepted = edit('', 0);
      if (node) {
        node.value = accepted.display;
        node.focus();
      }
    },
    change(next) {
      let changed = false;
      shell.edit(
        (onValue) =>
          field.updateValue(next, (accepted) => {
            changed = true;
            onValue(accepted);
          }),
        (accepted) => {
          options.onValue(accepted);
          options.onChange(accepted);
        },
      );
      if (node) {
        node.value = display();
      }
      return changed;
    },
    attach(element) {
      node = element;
      // Its place in a group follows the document, not the mount order.
      options.group?.reorder();
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
