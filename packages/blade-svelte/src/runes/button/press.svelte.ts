import { untrack } from 'svelte';
import { isPromise } from '../base/promise';
import { getAdapters } from '../../adapters';
import { getAnnounce } from '../announce/announce';
import { createFlash } from '../base/flash.svelte';
import type { Schedule } from '../base/schedule';
import type { FormAdapter, FormErrors } from '../form/types';
import { getHaptics } from '../haptics/haptics';

export interface ButtonHooks {
  /** Validation blocked the press: the form reports it and reveals the field. */
  onValidationFailed?: (errors: FormErrors) => void;
  /** What the press meant, for haptics: `warning` when it shook, `press` otherwise. */
  onFeedback?: (kind: 'warning' | 'press') => void;
  onError?: (error: unknown) => void;
}

export interface ButtonOptions {
  form?: FormAdapter;
  /** Getters — the host's props change reactively. `type` defaults to 'submit'. */
  type?: () => 'submit' | 'button' | undefined;
  validateForm?: () => boolean;
  onClick?: (event?: unknown) => unknown;
  hooks?: ButtonHooks;
  /** Times the shake: injected so tests never sleep. */
  schedule?: Schedule;
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
  /** An invalid press; auto-clears after 400ms. Tracked. */
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

/** How long an invalid press shakes. */
const SHAKE_MS = 400;

/**
 * The press decision table shared by every button. Inside a form, a
 * submit-typed button drives the form model directly (the native submit is
 * cancelled), so the form validates exactly once per press; `validateForm`
 * gets the same treatment for type=button, plus shake/reveal on failure.
 * The consumer `onClick` runs only when the form passed.
 */
export function createButton(options: ButtonOptions = {}): ButtonModel {
  let loading = $state(false);
  const shaking = createFlash<true>(SHAKE_MS, options.schedule);

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
            const outcome = submits ? await form.submit(event) : await form.validate();
            isInvalid = !outcome.ok;
            if (isInvalid && options.validateForm?.()) {
              shaking.show(true);
              shook = true;
              options.hooks?.onValidationFailed?.(outcome.errors);
            }
          } catch (error: unknown) {
            options.hooks?.onError?.(error);
          }
          options.hooks?.onFeedback?.(shook ? 'warning' : 'press');
          // Validation blocked the press: the consumer's action does not run.
          // A submit that threw has no verdict, so the click still goes on.
          if (!isInvalid) {
            await runOnClick(event);
          }
        })();
        return { prevented: submits, settled };
      }

      options.hooks?.onFeedback?.('press');
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
  /** Said to a screen reader when the button turns busy, as Blade's "Started loading". */
  loadingAnnouncement: () => string;
  /** Said when it is no longer busy, as Blade's "Stopped loading". */
  loadedAnnouncement: () => string;
}

export interface Press {
  readonly type: 'submit' | 'button';
  readonly busyCause: ButtonBusyCause | undefined;
  readonly busy: boolean;
  readonly shake: boolean;
  handleClick: (event: MouseEvent) => void;
}

/**
 * The press behaviour every button anatomy shares: the button model above
 * wired to the enclosing Form, the adapters and the three sources of busy.
 * Busy turning on and off is said through the one announcer, as Blade's
 * BaseButton does. Call it during component initialisation (it reads
 * context).
 */
export function createPress(options: PressOptions): Press {
  const adapters = getAdapters();
  const form = adapters.form;
  const haptics = getHaptics();
  const announce = getAnnounce();
  const type = $derived(options.type());

  const model = createButton({
    form,
    type: () => type,
    validateForm: () => type === 'submit' || options.validateForm(),
    onClick: (event) => options.onClick(event as MouseEvent),
    hooks: {
      onValidationFailed: (errors) => form?.invalid(errors),
      onFeedback: haptics,
      onError: (error) => adapters.reportError?.(error),
    },
  });

  // Submit-typed buttons mirror the form's submission — Enter-key
  // submissions never touch this button's press path, so the form model is
  // the only source that covers them.
  const busyCause = $derived.by((): ButtonBusyCause | undefined => {
    if (type === 'submit' && form?.isSubmitting) {
      return 'form';
    }
    if (model.loading) {
      return 'press';
    }
    return options.isLoading() ? 'host' : undefined;
  });

  // `aria-busy` alone is not announced by most screen readers.
  let wasBusy = false;
  $effect(() => {
    const isBusy = busyCause !== undefined;
    if (isBusy !== wasBusy) {
      wasBusy = isBusy;
      untrack(() =>
        announce(isBusy ? options.loadingAnnouncement() : options.loadedAnnouncement()),
      );
    }
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
    handleClick(event) {
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
  };
}
