import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { getAdapters } from '../../adapters';
import { setupField } from '../form/field.svelte';
import { createFieldLine } from '../form/field-line.svelte';
import {
  visibleFieldError,
  type FieldHint,
  type ValidationState,
} from '../form/hint';

export type FillMethod = 'paste' | 'autofill';

/**
 * What a key did in a cell. The anatomy cancels the platform event for every
 * action except `submit` (Enter must reach the form) and null (a chord: the
 * browser owns it — Ctrl/Cmd shortcuts and paste arrive via their own events).
 */
export type CellKeyAction =
  | 'set'
  | 'clear'
  | 'retreat'
  | 'prev'
  | 'next'
  | 'submit'
  | 'reject';

export interface CompositeInputState {
  /** One string per cell; '' = empty. */
  cells: readonly string[];
  /** The cells joined — the logical value. */
  value: string;
  /** Every cell holds a character. */
  filled: boolean;
  /**
   * The cell that should hold focus. Every interaction re-anchors it to the
   * cell that raised the event, then moves it only when the action does, so
   * an anatomy may apply it on every publish (focusing the already-focused
   * cell is a no-op). -1 = untouched so far: leave focus alone.
   */
  focusIndex: number;
}

export interface CompositeInputOptions {
  /** Number of cells; fixed at construction. */
  length: number;
  /** Per-character sanitizer: return '' to reject. Default: a single digit. */
  accept?: (char: string) => string;
  /** Fires only when the joined value actually changed. */
  onChange?: (value: string) => void;
  /** How a full multi-cell fill arrived (analytics). */
  onFill?: (method: FillMethod) => void;
}

export interface CompositeInputModel {
  /** Replaced on every publish; tracked by whatever reads it. */
  readonly state: CompositeInputState;
  value(): string;
  /** Replace the whole value programmatically (auto-read, reset). */
  setValue(value: string): void;
  /**
   * Text committed into cell `index` by the platform: a single typed char
   * (soft-IME paths that bypass keydown), or a multi-char commit — a
   * platform autofill / keyboard suggestion, distributed across the cells.
   */
  inputAt(index: number, text: string): void;
  /** Clipboard paste into cell `index`: fills forward from there. */
  pasteAt(index: number, text: string): void;
  /** A key pressed in cell `index`; mutates the cells and answers with the action taken. */
  keyAt(
    index: number,
    key: string,
    mods?: { shift?: boolean; ctrl?: boolean; meta?: boolean }
  ): CellKeyAction | null;
}

const acceptDigit = (char: string): string => (/^\d$/.test(char) ? char : '');

/**
 * A single logical value entered across N one-character cells (OTP, PIN):
 * auto-advance on entry, backspace retreat, paste/autofill distribution, and
 * roving focus as data. Deliberately not composed from `registry` /
 * `navigable-list`: the cells are a fixed array with no registration
 * lifecycle, and focus here is real platform focus (one control per cell),
 * not an aria-activedescendant roving index.
 */
export function createCompositeInput(
  options: CompositeInputOptions
): CompositeInputModel {
  const length = Math.max(0, options.length);
  const accept = options.accept || acceptDigit;
  const cells: string[] = new Array(length).fill('');
  let focusIndex = -1;
  let lastValue = '';

  const toState = (): CompositeInputState => {
    const value = cells.join('');
    return {
      cells: [...cells],
      value,
      filled: length > 0 && cells.every(Boolean),
      focusIndex,
    };
  };
  let state = $state.raw(toState());

  function publish(): void {
    const next = toState();
    state = next;
    if (next.value !== lastValue) {
      lastValue = next.value;
      options.onChange?.(next.value);
    }
  }

  function sanitize(text: string): string[] {
    return [...text].map(accept).filter(Boolean);
  }

  /** Writes `chars` into consecutive cells; returns the index of the last written cell. */
  function distribute(start: number, chars: string[]): number {
    let last = start;
    for (let i = 0; i < chars.length && start + i < length; i++) {
      cells[start + i] = chars[i];
      last = start + i;
    }
    return last;
  }

  function clampIndex(index: number): number {
    return Math.min(Math.max(0, index), length - 1);
  }

  return {
    get state() {
      return state;
    },
    value: () => state.value,

    setValue(next) {
      const chars = next === '' ? [] : [...next];
      for (let i = 0; i < length; i++) {
        cells[i] = chars[i] ?? '';
      }
      publish();
    },

    inputAt(index, text) {
      const at = clampIndex(index);
      // The event carries where platform focus really is; syncing here keeps
      // `focusIndex` truthful even for actions that do not move it.
      focusIndex = at;
      const chars = sanitize(text);
      if (chars.length > 1) {
        // A full commit distributes from the first cell (iOS keyboard
        // autofill types the whole code into the focused box); a partial
        // multi-char commit fills forward from the edited cell.
        const start = chars.length >= length ? 0 : at;
        focusIndex = distribute(start, chars);
        if (chars.length >= length) {
          options.onFill?.('autofill');
        }
      } else if (chars.length === 1) {
        cells[at] = chars[0];
        focusIndex = Math.min(at + 1, length - 1);
      } else if (text === '') {
        // The platform emptied the cell itself (native has no key events,
        // so a delete only ever arrives as an empty commit; on web: cut).
        cells[at] = '';
      }
      // A rejected char still publishes, so the anatomy resyncs the cell
      // the platform already painted.
      publish();
    },

    pasteAt(index, text) {
      const at = clampIndex(index);
      const chars = sanitize(text).slice(0, length - at);
      if (!chars.length) {
        return;
      }
      focusIndex = at;
      focusIndex = distribute(at, chars);
      options.onFill?.('paste');
      publish();
    },

    keyAt(index, key, mods = {}) {
      if (mods.ctrl || mods.meta) {
        return null;
      }
      const at = clampIndex(index);
      // The key event carries where platform focus really is.
      focusIndex = at;
      let action: CellKeyAction;
      switch (key) {
        case 'Backspace':
        case 'Delete':
          if (cells[at]) {
            cells[at] = '';
            action = 'clear';
          } else if (at > 0) {
            // Empty cell: the deletion applies to the previous one.
            cells[at - 1] = '';
            focusIndex = at - 1;
            action = 'retreat';
          } else {
            action = 'clear';
          }
          break;
        case 'Tab':
          focusIndex = clampIndex(mods.shift ? at - 1 : at + 1);
          action = mods.shift ? 'prev' : 'next';
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          focusIndex = clampIndex(at - 1);
          action = 'prev';
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          focusIndex = clampIndex(at + 1);
          action = 'next';
          break;
        case 'Enter':
          return 'submit';
        default: {
          const char = key.length === 1 ? accept(key) : '';
          if (!char) {
            return 'reject';
          }
          cells[at] = char;
          focusIndex = Math.min(at + 1, length - 1);
          action = 'set';
        }
      }
      publish();
      return action;
    },
  };
}

export type OTPValidationState = ValidationState;

export interface OTPOptions {
  /** The host's `$props.id()`: the label and hint ids hang off it. */
  id: string;
  value: () => string | undefined;
  /** The bindable write: every accepted value, user edit or not. */
  onValue: (value: string) => void;
  /** A user edit changed the value; outside `value` changes do not fire it. */
  onChange?: (value: string) => void;
  /** Every cell holds a character — by typing, paste, autofill or `value`. */
  onFilled?: (value: string) => void;
  /** Number of cells; fixed at mount. */
  length: number;
  /** Per-character sanitizer: return '' to reject. Default: a single digit. */
  accept?: (char: string) => string;
  /** Fixed at mount. */
  autoFocus: () => boolean;
  name: () => string | undefined;
  isDisabled: () => boolean;
  isRequired: () => boolean;
  isReadOnly: () => boolean;
  validationState: () => OTPValidationState | undefined;
  hint: () => string | undefined;
}

export interface OTP {
  /** The cells, one string each. */
  readonly cells: readonly string[];
  /** The one line under the control and the state it puts the control in. */
  readonly hint: FieldHint;
  readonly labelId: string;
  readonly hintId: string;
  handleInput(event: Event, index: number): void;
  handleKeyDown(event: KeyboardEvent, index: number): void;
  handlePaste(event: ClipboardEvent, index: number): void;
  handleFocusOut(event: FocusEvent): void;
  /** On the root: where a focus move between cells is not a visit ending. */
  readonly attachRoot: Attachment<HTMLElement>;
  /** On each cell: how the model moves focus, and the autofocus on mount. */
  cell(index: number): Attachment<HTMLInputElement>;
}

/**
 * The one-time-code behaviour: a form field of `length` characters spread
 * over as many cells, with the model's focus rule. Call during component
 * initialisation.
 */
export function createOTP(options: OTPOptions): OTP {
  const adapters = getAdapters();
  let root: HTMLElement | undefined;
  const cellRefs: HTMLInputElement[] = [];
  const autoFocus = options.autoFocus();

  // A partial code is a pattern mismatch, so the form blocks it like any
  // other constraint.
  const fieldProps = () => ({
    name: options.name(),
    value: options.value(),
    required: options.isRequired(),
    pattern: `.{${options.length}}`,
    disabled: options.isDisabled(),
    readonly: options.isReadOnly(),
  });

  const { field, form, notifyInput, blur } = setupField(
    fieldProps(),
    'text',
    (next) => {
      options.onValue(next as string);
    }
  );
  field.setHandle(() => cellRefs[0]);

  const model = createCompositeInput({
    length: options.length,
    accept: (char) =>
      options.accept ? options.accept(char) : /^\d$/.test(char) ? char : '',
    onChange: (next) => {
      let edited = false;
      field.updateValue(next, (accepted) => {
        edited = true;
        options.onValue(accepted as string);
        options.onChange?.(accepted as string);
      });
      if (edited) {
        notifyInput();
      }
      if (model.state.filled) {
        options.onFilled?.(next);
      }
    },
    // How a multi-cell fill arrived is analytics only, so it goes to the
    // adapters' sink like every other library event, not to a prop.
    onFill: (method) =>
      adapters.track?.('otp_fill', { name: options.name(), method }),
  });

  // Pre-effect: the first run lands before the template reads the cells, so
  // the first paint already shows `value`; later runs keep the field in
  // step with prop changes and spread an outside `value` over the cells.
  // The model's own value is untracked: a user edit must not re-run this.
  $effect.pre(() => {
    field.updateProps(fieldProps());
    const next = options.value() ?? '';
    if (next !== untrack(() => model.value())) {
      model.setValue(next);
    }
  });

  const line = createFieldLine(
    form,
    () => ({
      validationState: options.validationState(),
      hint: options.hint(),
    }),
    (state) => visibleFieldError(field.record, state)
  );

  // Focus follows the model only from a user interaction, never from an
  // outside `value` change — an auto-read must not steal focus.
  function followFocus() {
    const { focusIndex } = model.state;
    if (focusIndex >= 0) {
      cellRefs[focusIndex]?.focus();
    }
  }

  // Svelte only writes `value={cell}` when the cell string changes, so a
  // rejected character the platform already painted is wiped by hand.
  function syncCell(target: HTMLInputElement, index: number) {
    const cell = model.state.cells[index] ?? '';
    if (target.value !== cell) {
      target.value = cell;
    }
  }

  return {
    get cells() {
      return model.state.cells;
    },
    get hint() {
      return line.hint;
    },
    labelId: `${options.id}-label`,
    hintId: `${options.id}-hint`,
    // Native sends no key, paste or focus events: every edit — a typed
    // character, an autofill, a delete (as an empty commit) — arrives here,
    // and the platform advances focus itself (`advance`).
    handleInput(event, index) {
      const target = event.target as HTMLInputElement;
      model.inputAt(index, target.value);
      syncCell(target, index);
      followFocus();
    },
    handleKeyDown(event, index) {
      if (options.isReadOnly()) {
        return;
      }
      const action = model.keyAt(index, event.key, {
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
        meta: event.metaKey,
      });
      // Enter flows through to submit the form; chords (null) stay with the
      // browser; Tab at either end leaves the group.
      const leaves = event.key === 'Tab' && model.state.focusIndex === index;
      if (action !== null && action !== 'submit' && !leaves) {
        event.preventDefault();
      }
      followFocus();
    },
    handlePaste(event, index) {
      event.preventDefault();
      if (options.isReadOnly()) {
        return;
      }
      model.pasteAt(index, event.clipboardData?.getData('text/plain') || '');
      followFocus();
    },
    handleFocusOut(event) {
      // Moving between cells is not a visit ending.
      if (root?.contains(event.relatedTarget as Node | null)) {
        return;
      }
      field.touch();
      blur();
    },
    attachRoot(node) {
      root = node;
      return () => {
        root = undefined;
      };
    },
    cell(index) {
      return (node) => {
        cellRefs[index] = node;
        if (
          index === 0 &&
          autoFocus &&
          !options.isDisabled() &&
          !options.isReadOnly()
        ) {
          node.focus();
        }
        return () => {
          delete cellRefs[index];
        };
      };
    },
  };
}
