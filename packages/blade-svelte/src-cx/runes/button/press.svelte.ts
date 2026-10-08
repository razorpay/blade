import type { Attachment } from 'svelte/attachments';
import { isPromise } from '../base/promise';
import { getAdapters } from '../../adapters';
import { createFlash } from '../base/flash.svelte';
import type { Schedule } from '../base/schedule';
import { createCountdown } from '../countdown/countdown.svelte';
import { getForm, getFormHooks } from '../form/context';
import type { FormErrors, FormModel } from '../form/types';

export interface ButtonHooks {
  /**
   * Validation blocked the press. Revealing the first invalid field is the
   * owner's job here — `form.revealFirstInvalid()` or a bespoke reveal.
   */
  onValidationFailed?: (errors: FormErrors) => void;
  /** Haptics: 'warning' when this press shook, 'medium' otherwise. */
  onFeedback?: (kind: 'warning' | 'medium') => void;
  onError?: (error: unknown) => void;
}

export interface ButtonOptions {
  form?: FormModel;
  /** Getters — the host's props change reactively. `type` defaults to 'submit'. */
  type?: () => 'submit' | 'button' | undefined;
  validateForm?: () => boolean;
  onClick?: (event?: unknown) => unknown;
  hooks?: ButtonHooks;
  schedule?: Schedule;
  /** ms the shake state stays on. Default 400. */
  shakeDuration?: number;
}

export interface PressDecision {
  /** Cancel the platform default: a submit button inside a form drives the model, not the browser. */
  prevented: boolean;
  /** Settles when validation, submission and the consumer `onClick` are done. Never rejects. */
  settled: Promise<void>;
}

export interface ButtonModel {
  /** An async consumer `onClick` is in flight. Tracked by whatever reads it. */
  readonly loading: boolean;
  /** An invalid press; auto-clears after `shakeDuration`. Tracked. */
  readonly shake: boolean;
  /**
   * One press. The decision is synchronous — the anatomy must be able to
   * cancel the platform event inside the handler — while the work
   * (validate/submit, consumer `onClick`) runs behind `settled`. A busy
   * button never presses: its anatomy swallows the click first.
   */
  press(event?: unknown): PressDecision;
}

const settledResult = (): void => undefined;

/**
 * The press decision table shared by every button. Inside a form, a
 * submit-typed button drives the form model directly (the native submit is
 * cancelled), so the form validates exactly once per press; `validateForm`
 * gets the same treatment for type=button, plus shake/reveal on failure.
 * The consumer `onClick` runs only when the form passed.
 */
export function createButton(options: ButtonOptions = {}): ButtonModel {
  let loading = $state(false);
  const shaking = createFlash<true>(options.shakeDuration ?? 400, options.schedule);

  /** Runs the consumer onClick; a returned promise drives `loading`. */
  function runOnClick(event?: unknown): Promise<void> {
    const result = options.onClick?.(event);
    if (!isPromise(result)) {
      return Promise.resolve();
    }
    loading = true;
    return result
      .then(settledResult, (error: unknown) => {
        options.hooks?.onError?.(error);
      })
      .finally(() => {
        loading = false;
      });
  }

  return {
    get loading() {
      return loading;
    },
    get shake() {
      return shaking.value === true;
    },
    press(event) {
      const form = options.form;
      const submits = Boolean(form) && (options.type?.() ?? 'submit') === 'submit';

      if (form && (submits || options.validateForm?.())) {
        const settled = (async () => {
          let shook = false;
          let isInvalid = false;
          try {
            const outcome = submits
              ? await form.submit({ source: 'button', field: form.name, event })
              : await form.validate();
            isInvalid = !outcome.ok;
            if (isInvalid && options.validateForm?.()) {
              shaking.show(true);
              shook = true;
              options.hooks?.onValidationFailed?.(outcome.errors);
            }
          } catch (error: unknown) {
            options.hooks?.onError?.(error);
          }
          options.hooks?.onFeedback?.(shook ? 'warning' : 'medium');
          // Validation blocked the press: the consumer's action does not run.
          // A submit that threw has no verdict, so the click still goes on.
          if (!isInvalid) {
            await runOnClick(event);
          }
        })();
        return { prevented: submits, settled };
      }

      options.hooks?.onFeedback?.('medium');
      return { prevented: false, settled: runOnClick(event) };
    },
  };
}

/** Why a button is busy: the host said so, its own press, or the form it submits. */
export type ButtonBusyCause = 'host' | 'press' | 'form';

/** The HTML button type: a `submit` presses the enclosing Form. */
export type ButtonType = 'submit' | 'button';

export interface PressOptions {
  type: () => ButtonType;
  /** A `button` that still validates the Form before it acts; a `submit` always does. */
  validateForm: () => boolean;
  isLoading: () => boolean;
  isDisabled: () => boolean;
  onClick: (event: MouseEvent) => void;
  /**
   * Seconds after which the button presses itself, its fill showing the
   * time run. A press by hand ends the wait; a disabled or busy button
   * does not count. Read once, at mount; 0 (the default) never presses.
   */
  autoPressAfter?: () => number;
}

export interface Press {
  readonly type: 'submit' | 'button';
  readonly busyCause: ButtonBusyCause | undefined;
  readonly busy: boolean;
  readonly shake: boolean;
  /** The auto-press's progress, 0–1, while one is running. */
  readonly elapsed: number | undefined;
  handleClick: (event: MouseEvent) => void;
  /** On the button: the element an auto-press clicks. */
  readonly attach: Attachment<HTMLButtonElement>;
}

/**
 * The press behaviour every button anatomy shares: the button model above
 * wired to the enclosing Form, the adapters and the three sources of busy.
 * Call it during component initialisation (it reads context).
 */
export function createPress(options: PressOptions): Press {
  const form = getForm();
  const formHooks = getFormHooks();
  const adapters = getAdapters();
  const type = $derived(options.type());

  const model = createButton({
    form,
    type: () => type,
    validateForm: () => type === 'submit' || options.validateForm(),
    onClick: (event) => options.onClick(event as MouseEvent),
    hooks: {
      onValidationFailed: (errors) => formHooks.onInvalid?.(errors),
      onFeedback: (kind) =>
        kind === 'warning' ? adapters.haptics?.warning() : adapters.haptics?.medium(),
      onError: (error) => adapters.captureError?.(error),
    },
  });

  // Submit-typed buttons mirror the form's submission — Enter-key
  // submissions never touch this button's press path, so the form model is
  // the only source that covers them.
  const busyCause = $derived.by((): ButtonBusyCause | undefined => {
    if (type === 'submit' && form?.state.submitting) {
      return 'form';
    }
    if (model.loading) {
      return 'press';
    }
    return options.isLoading() ? 'host' : undefined;
  });

  let node: HTMLButtonElement | undefined;
  // The wait is over: by hand or by the clock. The clock itself is not
  // told, so its last state stays what it was.
  let ended = $state(false);

  // A disabled or busy button does not count.
  const autoPressAfter = options.autoPressAfter?.() ?? 0;
  const auto = autoPressAfter
    ? createCountdown({
        seconds: () => autoPressAfter,
        isPaused: () => options.isDisabled() || busyCause !== undefined,
        // A real click, so the press runs the path a hand's would.
        onElapsed: () => {
          ended = true;
          node?.click();
        },
      })
    : undefined;

  const elapsed = $derived.by((): number | undefined => {
    if (!auto || ended) {
      return undefined;
    }
    const { remaining, progress } = auto.current;
    return remaining ? progress / 100 : undefined;
  });

  return {
    get type() {
      return type;
    },
    get busyCause() {
      return busyCause;
    },
    get busy() {
      return busyCause !== undefined;
    },
    get shake() {
      return model.shake;
    },
    get elapsed() {
      return elapsed;
    },
    handleClick(event) {
      auto?.cancel();
      ended = true;
      // isDisabled: browsers suppress clicks on disabled buttons, synthetic
      // dispatch (tests, programmatic .click()) does not — mirror the
      // platform. busy: the button stays enabled to keep focus (a `disabled`
      // flip mid-press ejects focus to <body>), so impatient presses must be
      // swallowed here.
      if (options.isDisabled() || busyCause !== undefined) {
        event.preventDefault();
        return;
      }
      if (model.press(event).prevented) {
        event.preventDefault();
      }
    },
    attach(element) {
      node = element;
      return () => {
        node = undefined;
      };
    },
  };
}
