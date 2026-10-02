import { onDestroy } from 'svelte';
import { createFlash } from '../base/flash.svelte';
import { fieldIds, setupField } from '../form/field.svelte';

export interface CounterInputOptions {
  /** The host's `$props.id()`: the input and label ids hang off it. */
  id: string;
  value: () => number | undefined;
  /** The bindable write: every accepted value. */
  onValue: (value: number) => void;
  /** A step or an edit changed the value. */
  onChange?: (value: number) => void;
  min: () => number;
  max: () => number | undefined;
  name: () => string | undefined;
  isDisabled: () => boolean;
  isLoading: () => boolean;
}

export interface CounterInput {
  readonly inputId: string;
  readonly labelId: string;
  /** The value shown: the prop, else `min`. */
  readonly current: number;
  /** Digits the field is sized for: at least 2, and room for a minus. */
  readonly digits: number;
  /** Disabled, or loading: neither button nor the field takes input. */
  readonly isInert: boolean;
  readonly isDecrementDisabled: boolean;
  readonly isIncrementDisabled: boolean;
  /** Set for a moment after a step: the number slides in from that side. */
  readonly slide: 'up' | 'down' | undefined;
  /** Focus came from the keyboard: draw the field's ring. */
  readonly isKeyboardFocus: boolean;
  increment(): void;
  decrement(): void;
  handleInput(event: Event): void;
  handleBlur(): void;
}

/**
 * Blade's CounterInput: a number between `min` and `max`, stepped by its
 * two buttons or typed, over a form field so a Form collects it by `name`.
 * Call during component initialisation.
 */
export function createCounterInput(options: CounterInputOptions): CounterInput {
  const setup = setupField(
    () => ({
      name: options.name(),
      value: options.value(),
      disabled: options.isDisabled(),
    }),
    undefined,
    (next) => options.onValue(next as number)
  );
  const { field, blur, edit } = setup;
  // Pre-effect: the field follows its props from before the first paint.
  $effect.pre(setup.syncProps);

  const current = $derived(options.value() ?? options.min());
  const isInert = $derived(options.isDisabled() || options.isLoading());
  const max = $derived(options.max());

  const slide = createFlash<'up' | 'down'>(300);

  // React shows the field's ring after Tab only: `:focus-visible` on a text
  // field also matches a click.
  let isKeyboardFocus = $state(false);
  $effect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        isKeyboardFocus = true;
      }
    };
    const onPointer = () => {
      isKeyboardFocus = false;
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('mousedown', onPointer, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('mousedown', onPointer, true);
    };
  });
  onDestroy(slide.cancel);

  const clamp = (value: number): number => {
    const low = Math.max(value, options.min());
    return max === undefined ? low : Math.min(low, max);
  };

  function commit(next: number, event?: Event): void {
    if (next === current) {
      return;
    }
    edit(
      (onValue) => {
        field.updateValue(next, onValue);
        field.touch();
      },
      () => {
        options.onValue(next);
        options.onChange?.(next);
      },
      event
    );
  }

  function step(by: 1 | -1): void {
    if (isInert) {
      return;
    }
    const next = clamp(current + by);
    if (next === current) {
      return;
    }
    commit(next);
    // The new number slides in: from below going up, from above going down.
    slide.show(by > 0 ? 'up' : 'down');
  }

  return {
    inputId: `${options.id}-input`,
    labelId: fieldIds(options.id).labelId,
    get current() {
      return current;
    },
    get digits() {
      return Math.max(2, String(Math.abs(current)).length) + (current < 0 ? 1 : 0);
    },
    get isInert() {
      return isInert;
    },
    get isDecrementDisabled() {
      return isInert || current <= options.min();
    },
    get isIncrementDisabled() {
      return isInert || (max !== undefined && current >= max);
    },
    get slide() {
      return slide.value;
    },
    get isKeyboardFocus() {
      return isKeyboardFocus;
    },
    increment: () => step(1),
    decrement: () => step(-1),
    handleInput(event) {
      const target = event.target as HTMLInputElement;
      const parsed = target.value ? parseInt(target.value, 10) : options.min();
      const next = clamp(Number.isNaN(parsed) ? options.min() : parsed);
      commit(next, event);
      // A value outside the range is written back as its clamp.
      if (target.value !== '' && target.value !== String(next)) {
        target.value = String(next);
      }
    },
    handleBlur: () => blur(),
  };
}
