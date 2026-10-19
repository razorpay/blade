import { defineContext } from './runes/context';
import type { FormAdapter } from './runes/form/types';
import type { Toasts } from './components/toast/toasts';
import type { PresentDropdownAdapter } from './runes/modal/dropdown';

export type { PresentDropdownAdapter };

/** What a press or a pick meant: what `adapters.vibrate` is told. */
export type HapticKind = 'press' | 'select' | 'toggle' | 'warning';

/**
 * The injection seam for app services. Styling is NOT here — classes are the
 * component's own (`components/<name>/styles.ts`) and runtime theming is CSS
 * vars only. Every adapter is optional: components run
 * standalone (stories, tests) on no-op defaults.
 */
export interface BladeAdapters {
  /** Analytics sink for component lifecycle and interaction events. */
  track?: (event: string, payload?: Record<string, unknown>) => void;
  /**
   * What a press or a pick meant, for the app to feel (`HapticKind`):
   * `press` (a button), `select` (a choice picked), `toggle` (a switch or a
   * checkbox flipped), `warning` (a press a form refused). Blade only
   * reports; the adapter decides whether, and how, the device vibrates.
   */
  vibrate?: (kind: HapticKind) => void;
  /**
   * Says a message to a screen reader, politely: a button that starts or
   * stops loading. @default the live region in BladeProvider's overlay host
   */
  announce?: (message: string) => void;
  /**
   * The BCP 47 locale Amount formats with (grouping, the currency's side).
   * Reactive, unlike i18nify's own state, which stays the fallback.
   * @default i18nify's locale
   */
  locale?: string;
  /**
   * Errors the components catch and can't surface themselves: a rejected
   * press or toast action, a failed `readOTP` or `presentDropdown`. The app
   * decides where they go.
   */
  reportError?: (error: unknown) => void;
  /**
   * An app router's hook into Link: called for a plain click on an internal
   * href. Return true once the navigation is handled, and the browser's is
   * cancelled.
   */
  navigate?: (href: string, event: MouseEvent) => boolean;
  /**
   * The toast queue under this provider: a Blade queue (`createToasts()`),
   * which a ToastContainer under it shows, or the app's own
   * `{ showToast }`, which shows toasts its own way. Read when the
   * ToastContainer mounts.
   * @default the page's (`showToast`)
   */
  toasts?: Toasts;
  /**
   * The app's form around these fields (`FormAdapter`): what they register
   * with, report edits to, and what submit buttons submit. An app's Form
   * hands it to the fields under it through a BladeProvider. Without one a
   * field is standalone and a submit button just clicks.
   */
  form?: FormAdapter;
  /**
   * Takes a library dropdown over (PhoneNumberInput's country list): the
   * app shows it its own way — a modal, a sheet — and returns a promise of
   * the pick, resolving `undefined` when the user leaves without one
   * (`request.cancelled` resolves when the field closes it: it unmounted,
   * or opened another). Return `undefined` instead of a promise (or leave the
   * adapter out) for Blade's dropdown under the field, as React's.
   */
  presentDropdown?: PresentDropdownAdapter;
  /**
   * Reads a one-time code for an OTPInput (a native host's SMS retriever,
   * the WebOTP API): asked once the field is mounted and enabled, with its
   * `length`, and again when the owner resets its `value` to '' (a resend;
   * a request still pending is kept, not doubled). Resolve with the code
   * to fill the cells, as a paste does (`method: 'adapter'`), or
   * `undefined` for none. `cancelled` resolves (never rejects, and is
   * never already resolved when handed over) when the field unmounts, is
   * disabled, or the user starts entering the code; a later result is
   * ignored, a rejection too. Otherwise a rejection goes to `reportError`.
   * A native host forwards it:
   * `request.cancelled.then(() => bridge.send('otp.dismiss'))`.
   */
  readOTP?: (request: { length: number; cancelled: Promise<void> }) => Promise<string | undefined>;
}

/**
 * What a provider passes: each adapter, or `null` for none here — the
 * subtree reads it as left out, whatever the enclosing provider has (a
 * country list that must not join the app's form).
 */
export type BladeAdaptersOverride = {
  [K in keyof BladeAdapters]?: BladeAdapters[K] | null;
};

const ADAPTERS = defineContext<BladeAdapters>('blade-adapters');

/**
 * Call during component init: descendants read these adapters over the
 * enclosing ones (an adapter left undefined is the enclosing one's, a
 * `null` one is none). Pass a getter to keep them live: every read goes
 * through it, so an app that swaps an adapter reaches the components
 * already mounted.
 */
export function provideAdapters(
  adapters: BladeAdaptersOverride | (() => BladeAdaptersOverride),
): void {
  const own = typeof adapters === 'function' ? adapters : () => adapters;
  const parent = getAdapters();
  const read = (key: string): unknown => {
    const mine = (own() as Record<string, unknown>)[key];
    return mine === null ? undefined : mine ?? (parent as Record<string, unknown>)[key];
  };
  const keys = (): string[] => [...new Set([...Object.keys(parent), ...Object.keys(own())])];
  // A live view, not a copy: `getAdapters().track` is the current one.
  ADAPTERS.set(
    new Proxy({} as BladeAdapters, {
      get: (_target, key) => (typeof key === 'string' ? read(key) : undefined),
      has: (_target, key) => typeof key === 'string' && read(key) !== undefined,
      ownKeys: () => keys().filter((key) => read(key) !== undefined),
      getOwnPropertyDescriptor: (_target, key) =>
        typeof key === 'string' && read(key) !== undefined
          ? { value: read(key), enumerable: true, configurable: true, writable: false }
          : undefined,
    }),
  );
}

export function getAdapters(): BladeAdapters {
  return ADAPTERS.get() ?? {};
}
