import type { Component } from 'svelte';
import { defineContext } from '../context';
import type { BackAnswer } from '../base/back';
import { createPropsPatch, loadComponent, readyComponent } from '../base/lazy-component';
import type { LazyComponent } from '../base/lazy-component';
import { isPromise } from '../base/promise';
import { createLayerStack } from '../base/layer-stack.svelte';
import type { Layer } from '../base/layer-stack.svelte';
import { getLayers, globalLayers } from '../layer/layers';
import type { Layers } from '../layer/layers';

/** What a pushed component gets as its `screen` prop. */
export interface NavScreenControl<R = unknown> {
  /** Leaves this screen, and everything above it; `result` settles the pusher's promise. */
  pop(result?: R): void;
  /** Removes every screen above this one. */
  popAfter(): void;
  /** Removes only this screen, wherever it sits. */
  close(): void;
  /**
   * The screen's own answer to back while it is on top (unsaved input, a
   * confirmation of its own); replaces the pusher's. Returns the undo.
   */
  onBack(handler: () => BackAnswer): () => void;
}

/** A component, or the promise of one (a dynamic import resolves as is). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- a component's props are its own
export type NavComponent<P extends Record<string, any>> = LazyComponent<P>;

export interface PushScreenOptions<P, M = unknown> {
  /** Everything the component takes, except the `screen` prop it is given. */
  props?: Omit<P, 'screen'>;
  /** Stable name: analytics, tests (`data-screen`), the app's chrome. */
  name?: string;
  /** The app's own data about the screen (a title, a breadcrumb step). */
  meta?: M;
  /** Back pressed while this screen is on top. */
  onBack?: () => BackAnswer;
  /** The promised component failed to load; the screen is removed. */
  onLoadError?: (error: unknown) => void;
}

export interface NavHandle<P, R> extends NavScreenControl<R> {
  /** What `pop` was given; `undefined` for any other way out. */
  result: Promise<R | undefined>;
  /** New props for the mounted component. */
  update(props: Partial<Omit<P, 'screen'>>): void;
}

/** One screen, as NavStack renders it. */
export interface NavContent<M = unknown> {
  /** Undefined while a promised component is still loading. */
  component: Component<Record<string, unknown>> | undefined;
  props: Record<string, unknown>;
  name: string | undefined;
  meta: M | undefined;
  onBack: (() => BackAnswer) | undefined;
  control: NavScreenControl;
}

export type NavEntry<M = unknown> = Layer<NavContent<M>>;
export type NavDirection = 'forward' | 'back';

/**
 * Which way the stack last moved. Not reactive state on purpose: a leaving
 * screen must learn the direction synchronously, before Svelte removes it,
 * so `onDirection` runs inside the call that turns it.
 */
export interface NavDirectionSource {
  readonly direction: NavDirection;
  /** Runs on every turn, with the new direction. Returns the undo. */
  onDirection(listener: (direction: NavDirection) => void): () => void;
}

export interface Nav<M = unknown> extends NavDirectionSource {
  /** Bottom first; tracked by whatever reads it. */
  readonly entries: readonly NavEntry<M>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
  push<P extends Record<string, any>, R = unknown>(
    component: NavComponent<P>,
    options?: PushScreenOptions<P, M>,
  ): NavHandle<P, R>;
  /** Pushes, then removes every other screen once the new one can render. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
  replace<P extends Record<string, any>, R = unknown>(
    component: NavComponent<P>,
    options?: PushScreenOptions<P, M>,
  ): NavHandle<P, R>;
  /** Removes the top screen; the root screen stays. */
  pop(): boolean;
  /** Pops down to the topmost screen with this name. */
  popTo(name: string): boolean;
  clear(): void;
  /**
   * Back pressed: open layers answer first, then the top screen's `onBack`,
   * then the stack pops. False at the root — the app decides what leaving means.
   */
  back(): boolean;
  top(): NavEntry<M> | undefined;
  depth(): number;
  /** Set by the mounted NavStack: where load failures are reported. */
  reportError?: (error: unknown) => void;
}

export function createNav<M = unknown>(layers: Layers = globalLayers): Nav<M> {
  const stack = createLayerStack<NavContent<M>>();
  let direction: NavDirection = 'forward';
  const turns = new Set<(direction: NavDirection) => void>();

  function turn(next: NavDirection): void {
    if (next !== direction) {
      direction = next;
      turns.forEach((listener) => listener(next));
    }
  }

  function move(next: NavDirection, change: () => void): void {
    turn(next);
    change();
  }

  function patch(layer: NavEntry<M>, next: Partial<NavContent<M>>): void {
    stack.update(layer, { ...layer.entry, ...next });
  }

  const nav: Nav<M> = {
    get entries() {
      return stack.entries;
    },
    get direction() {
      return direction;
    },
    onDirection(listener) {
      turns.add(listener);
      return () => {
        turns.delete(listener);
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
    push<P extends Record<string, any>, R = unknown>(
      component: NavComponent<P>,
      options: PushScreenOptions<P, M> = {},
    ): NavHandle<P, R> {
      const control: NavScreenControl<R> = {
        pop: (result) => move('back', () => layer.resolve(result)),
        popAfter: () => move('back', () => layer.popAfter()),
        close: () => move('back', () => layer.close()),
        onBack: (handler) => {
          const previous = layer.entry.onBack;
          layer.entry.onBack = handler;
          return () => {
            layer.entry.onBack = previous;
          };
        },
      };
      let layer = (undefined as unknown) as NavEntry<M>;
      move('forward', () => {
        layer = stack.push({
          component: readyComponent(component),
          props: { ...options.props },
          name: options.name,
          meta: options.meta,
          onBack: options.onBack,
          control: control as NavScreenControl,
        });
      });

      loadComponent(component, {
        onLoaded: (loaded) => move('forward', () => patch(layer, { component: loaded })),
        onError: (error) => {
          options.onLoadError?.(error);
          nav.reportError?.(error);
          layer.close();
        },
      });

      return {
        ...control,
        result: layer.promise as Promise<R | undefined>,
        update: createPropsPatch(options.props ?? {}, (props) => patch(layer, { props })),
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
    replace<P extends Record<string, any>, R = unknown>(
      component: NavComponent<P>,
      options?: PushScreenOptions<P, M>,
    ): NavHandle<P, R> {
      const handle = nav.push<P, R>(component, options);
      const added = stack.top();
      const rest = stack.entries.filter((layer) => layer !== added);
      const dropRest = (): void => rest.forEach((layer) => layer.close());
      // Once it can render, so the stack never shows nothing in between.
      if (isPromise(component)) {
        component.then(dropRest).catch(() => undefined);
      } else {
        dropRest();
      }
      return handle;
    },
    pop() {
      if (stack.size() <= 1) {
        return false;
      }
      move('back', () => stack.top()?.close());
      return true;
    },
    popTo(name) {
      const list = stack.entries;
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].entry.name === name) {
          move('back', () => stack.popTill(i + 1));
          return true;
        }
      }
      return false;
    },
    clear() {
      move('back', () => stack.clear());
    },
    back() {
      if (layers.back()) {
        return true;
      }
      turn('back');
      return stack.back({ onTop: (top) => top.entry.onBack?.() });
    },
    top: () => stack.top(),
    depth: () => stack.size(),
  };
  return nav;
}

/** One stack for the page; an embedded surface provides its own. */
export const globalNav = createNav();

const NAV = defineContext<unknown>('blade-nav');

/** Call during component init; descendants and its NavStack share it. */
export function provideNav<M = unknown>(): Nav<M> {
  const nav = createNav<M>(getLayers());
  NAV.set(nav);
  return nav;
}

export function getNav<M = unknown>(): Nav<M> {
  return (NAV.get() as Nav<M> | undefined) ?? (globalNav as Nav<M>);
}

/**
 * Pushes a screen from anywhere — a flow in a `.ts` file as much as a
 * component — on the page's stack. It needs a mounted `NavStack`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- as above
export function pushScreen<P extends Record<string, any>, R = unknown>(
  component: NavComponent<P>,
  options?: PushScreenOptions<P>,
): NavHandle<P, R> {
  return globalNav.push<P, R>(component, options);
}
