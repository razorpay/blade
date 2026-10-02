import type { Component } from 'svelte';
import { defineContext } from '../context';
import {
  createPropsPatch,
  loadComponent,
  readyComponent,
  type LazyComponent,
} from '../base/lazy-component';
import { createLayerStack } from '../base/layer-stack.svelte';
import type { DialogDismissEvent } from './dialog.svelte';

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
  /** The surface closed itself on a dismissal: settles `undefined`. */
  dismiss(id: number): void;
  /** The view reports the closing transition ended: the entry goes. */
  closed(id: number): void;
  count(): number;
}

/**
 * Imperatively opened overlays, as data, on a layer stack. An entry closes
 * in two steps — `closing` while the view plays its exit (its result
 * already settled), gone once the view says so — so the model never
 * guesses a transition's length.
 */
export function createOverlayStack<C>(): OverlayStack<C> {
  const stack = createLayerStack<{ phase: OverlayPhase; content: C }>();
  const entries = $derived(
    stack.entries.map((layer) => ({ id: layer.id, ...layer.entry }))
  );
  const layerOf = (id: number) => stack.entries.find((layer) => layer.id === id);

  function close(id: number, result: unknown): void {
    const layer = layerOf(id);
    if (layer?.entry.phase === 'open') {
      layer.settle(result);
      stack.update(layer, { ...layer.entry, phase: 'closing' });
    }
  }

  return {
    get entries() {
      return entries;
    },
    open<R>(content: C): OverlayHandle<C, R> {
      const layer = stack.push({ phase: 'open', content });
      return {
        result: layer.promise as Promise<R | undefined>,
        close: (value) => close(layer.id, value),
        update(change) {
          if (layer.entry.phase === 'open') {
            stack.update(layer, {
              ...layer.entry,
              content: { ...layer.entry.content, ...change },
            });
          }
        },
      };
    },
    dismiss: (id) => close(id, undefined),
    closed(id) {
      const layer = layerOf(id);
      if (layer?.entry.phase === 'closing') {
        layer.close();
      }
    },
    count: () => stack.size(),
  };
}

/** What an opened component gets as its `modal` prop. */
export interface ModalControl<R = unknown> {
  /** Closes the modal; `result` settles the opener's promise. */
  close(result?: R): void;
}

/** A component, or the promise of one (a dynamic import resolves as is). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a component's props are its own
export type ModalComponent<P extends Record<string, any>> = LazyComponent<P>;

/** What opening a modal decides about it, besides how it looks. */
export interface OpenModalBehaviour<P> {
  /** Everything the component takes, except the `modal` prop it is given. */
  props?: Omit<P, 'modal'>;
  title?: string;
  /** One muted line under the title. */
  subtitle?: string;
  /** Localized; the close button's accessible name. */
  closeLabel?: string;
  /** Localized; announced while a promised component loads. */
  pendingLabel?: string;
  /**
   * Whether a dismissal closes it by itself, and whether the close button
   * shows. When not, `onDismiss`'s `close` ends it.
   */
  isDismissible?: boolean;
  /**
   * The user asked it to go (close button, backdrop, Escape, back, a drag),
   * dismissible or not. A dismissal that closes settles `result` with
   * `undefined`.
   */
  onDismiss?: (event: DialogDismissEvent) => void;
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
        component: readyComponent(component),
        props: { ...props },
        options: rest as OpenModalOptions<unknown, S>,
        control,
      });

      loadComponent(component, {
        onLoaded: (loaded) => handle.update({ component: loaded }),
        onError: (error) => {
          options.onLoadError?.(error);
          overlays.reportError?.(error);
          handle.close();
        },
      });

      return {
        result: handle.result,
        close: handle.close,
        update: createPropsPatch(props ?? {}, (next) =>
          handle.update({ props: next })
        ),
      };
    },
  };
  return overlays;
}

const OVERLAYS = defineContext<unknown>('blade-overlays');

/** Call during component init; descendants and their ModalStack share it. */
export function provideOverlays<S extends object>(
  overlays: Overlays<S>
): Overlays<S> {
  OVERLAYS.set(overlays);
  return overlays;
}

/** The provided stack, else `fallback` (the library's page-wide one). */
export function getOverlays<S extends object>(
  fallback: Overlays<S>
): Overlays<S> {
  return (OVERLAYS.get() as Overlays<S> | undefined) ?? fallback;
}
