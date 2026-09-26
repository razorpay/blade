import { getContext, setContext, type Component } from 'svelte';
import type { BackAnswer } from '../base/back';
import type { DialogCloseSource } from './dialog.svelte';

export type OverlayPhase = 'open' | 'closing';

export interface OverlayEntry<C> {
  id: number;
  phase: OverlayPhase;
  content: C;
}

export interface OverlayHandle<C, R> {
  /** Closes it and settles `result`. Later calls do nothing. */
  close(result?: R): void;
  /** Settles once: with what `close` was given, `undefined` on a dismiss. */
  result: Promise<R | undefined>;
  /** Replaces part of the content while it is open (props that change). */
  update(patch: Partial<C>): void;
}

export interface OverlayStack<C> {
  /** In the order opened; tracked by whatever reads it. */
  readonly entries: ReadonlyArray<OverlayEntry<C>>;
  open<R = unknown>(content: C): OverlayHandle<C, R>;
  /** A close the surface decided (backdrop, Escape, back, a drag). */
  dismiss(id: number): void;
  /** The view reports the closing transition ended: the entry goes. */
  closed(id: number): void;
  count(): number;
}

/**
 * Imperatively opened overlays, as data. An entry closes in two steps —
 * `closing` while the view plays its exit, gone once the view says so — so
 * the model never guesses a transition's length.
 */
export function createOverlayStack<C>(): OverlayStack<C> {
  let entries = $state.raw<ReadonlyArray<OverlayEntry<C>>>([]);
  const settle = new Map<number, (result: unknown) => void>();
  let nextId = 0;

  function patch(id: number, change: Partial<OverlayEntry<C>>): void {
    entries = entries.map((entry) =>
      entry.id === id ? { ...entry, ...change } : entry
    );
  }

  function close(id: number, result: unknown): void {
    const resolve = settle.get(id);
    if (!resolve) {
      return;
    }
    settle.delete(id);
    patch(id, { phase: 'closing' });
    resolve(result);
  }

  return {
    get entries() {
      return entries;
    },
    open<R>(content: C): OverlayHandle<C, R> {
      const id = nextId;
      nextId += 1;
      const result = new Promise<R | undefined>((resolve) => {
        settle.set(id, resolve as (result: unknown) => void);
      });
      entries = [...entries, { id, phase: 'open', content }];
      return {
        result,
        close: (value) => close(id, value),
        update(change) {
          const entry = entries.find((item) => item.id === id);
          if (entry && entry.phase === 'open') {
            patch(id, { content: { ...entry.content, ...change } });
          }
        },
      };
    },
    dismiss: (id) => close(id, undefined),
    closed(id) {
      const entry = entries.find((item) => item.id === id);
      if (entry?.phase === 'closing') {
        entries = entries.filter((item) => item.id !== id);
      }
    },
    count: () => entries.length,
  };
}

/** What an opened component gets as its `modal` prop. */
export interface ModalControl<R = unknown> {
  /** Closes the modal; `result` settles the opener's promise. */
  close(result?: R): void;
}

type Module<C> = C | { default: C };

/** A component, or the promise of one (a dynamic import resolves as is). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a component's props are its own
export type ModalComponent<P extends Record<string, any>> =
  | Component<P>
  | Promise<Module<Component<P>>>;

/** What opening a modal decides about it, besides how it looks. */
export interface OpenModalBehaviour<P> {
  /** Everything the component takes, except the `modal` prop it is given. */
  props?: Omit<P, 'modal'>;
  title?: string;
  /** Localized; the close button exists only when it has a name. */
  closeLabel?: string;
  /** Localized; announced while a promised component loads. */
  pendingLabel?: string;
  isDismissible?: boolean;
  onBack?: () => BackAnswer;
  /** A close the modal decided itself: backdrop, Escape, back, a drag. */
  onDismiss?: (source: DialogCloseSource) => void;
  /** The promised component failed to load; the modal closes. */
  onLoadError?: (error: unknown) => void;
  role?: 'dialog' | 'alertdialog';
  accessibilityLabel?: string;
  testID?: string;
  class?: string;
}

/**
 * The behaviour options plus the style props `S` of whatever renders the
 * stack — the library binds `S` (`components/modal/overlays.ts`).
 */
export type OpenModalOptions<P, S extends object> = OpenModalBehaviour<P> & S;

export interface ModalHandle<P, R> {
  close(result?: R): void;
  /** What `close` was given; `undefined` when the modal was dismissed. */
  result: Promise<R | undefined>;
  /** New props for the open component. */
  update(props: Partial<Omit<P, 'modal'>>): void;
}

/** One opened modal, as a ModalStack renders it. */
export interface ModalContent<S extends object> {
  /** Undefined while a promised component is still loading. */
  component: Component<Record<string, unknown>> | undefined;
  props: Record<string, unknown>;
  options: OpenModalOptions<unknown, S>;
  control: ModalControl;
}

export interface Overlays<S extends object> {
  stack: OverlayStack<ModalContent<S>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
  openModal<P extends Record<string, any>, R = unknown>(
    component: ModalComponent<P>,
    options?: OpenModalOptions<P, S>
  ): ModalHandle<P, R>;
  /** Whether a ModalStack is mounted to render what gets opened. */
  hasHost: boolean;
  /** Set by the mounted ModalStack: where load failures are reported. */
  reportError?: (error: unknown) => void;
}

function isPromise<T>(value: unknown): value is Promise<T> {
  return typeof (value as { then?: unknown })?.then === 'function';
}

export function createOverlays<S extends object>(): Overlays<S> {
  const stack = createOverlayStack<ModalContent<S>>();

  const overlays: Overlays<S> = {
    stack,
    hasHost: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
    openModal<P extends Record<string, any>, R = unknown>(
      component: ModalComponent<P>,
      options: OpenModalOptions<P, S> = {} as OpenModalOptions<P, S>
    ): ModalHandle<P, R> {
      const { props, ...rest } = options;
      const control: ModalControl = {
        close: (result) => handle.close(result as R),
      };
      const handle = stack.open<R>({
        component: isPromise(component)
          ? undefined
          : (component as Component<Record<string, unknown>>),
        props: { ...props },
        options: rest as OpenModalOptions<unknown, S>,
        control,
      });

      if (isPromise<Module<Component<P>>>(component)) {
        component
          .then((loaded) => {
            const resolved =
              typeof loaded === 'function' ? loaded : loaded.default;
            handle.update({
              component: resolved as Component<Record<string, unknown>>,
            });
          })
          .catch((error: unknown) => {
            options.onLoadError?.(error);
            overlays.reportError?.(error);
            handle.close();
          });
      }

      let current: Record<string, unknown> = { ...props };
      return {
        result: handle.result,
        close: handle.close,
        update(next) {
          current = { ...current, ...next };
          handle.update({ props: current });
        },
      };
    },
  };
  return overlays;
}

const OVERLAYS = Symbol('blade-overlays');

/** Call during component init; descendants and their ModalStack share it. */
export function provideOverlays<S extends object>(
  overlays: Overlays<S>
): Overlays<S> {
  setContext(OVERLAYS, overlays);
  return overlays;
}

/** The provided stack, else `fallback` (the library's page-wide one). */
export function getOverlays<S extends object>(
  fallback: Overlays<S>
): Overlays<S> {
  return getContext<Overlays<S> | undefined>(OVERLAYS) ?? fallback;
}
