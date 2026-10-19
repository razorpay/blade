import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { defineContext } from '../context';
import { createNodeRef } from '../dom/node.svelte';
import { queueOf } from '../toast/toasts.svelte';
import type { ToastQueue, Toasts } from '../toast/toasts.svelte';
import { getLayers } from './layers';

export interface OverlayHost {
  /** Whether a surface is open. */
  readonly occupied: boolean;
  /** On the host element. */
  readonly host: Attachment<HTMLElement>;
  /** On the one scrim under every open modal. */
  readonly scrim: Attachment<HTMLElement>;
  /** On the box modal surfaces render into. */
  readonly surfaces: Attachment<HTMLElement>;
  /** The scrim was tapped. */
  dismissTop(): void;
}

/**
 * BladeProvider's overlay host: registers the host element and its parts
 * with the layers for as long as they are mounted. With `isolates`, everything beside the host goes inert
 * while a surface is open. Call during component initialisation.
 */
export function createOverlayHost(options: { isolates: boolean }): OverlayHost {
  const layers = getLayers();
  const host = createNodeRef<HTMLElement>();
  const scrim = createNodeRef<HTMLElement>();
  const surfaces = createNodeRef<HTMLElement>();
  const occupied = $derived(layers.top !== undefined);

  $effect(() => {
    layers.setHost(host.current, {
      scrim: scrim.current,
      surfaces: surfaces.current,
    });
    return () => layers.setHost(undefined);
  });

  // While a surface is open everything beside the host is inert: focus,
  // clicks and the screen reader's virtual cursor stay inside the surface.
  // Browsers without `inert` fall back to the surface's own focus trap.
  // After the flush: a surface open on the first render rendered in place,
  // before the host was there, and moves in only once the host registers —
  // inerted in place, it would carry `inert` into the host.
  $effect(() => {
    const node = host.current;
    if (!options.isolates || !node || !occupied) {
      return undefined;
    }
    let siblings: Element[] = [];
    let isCancelled = false;
    void tick().then(() => {
      if (isCancelled) {
        return;
      }
      siblings = Array.from(node.parentElement?.children ?? []).filter(
        (element) => element !== node && !element.hasAttribute('inert'),
      );
      siblings.forEach((element) => element.setAttribute('inert', ''));
    });
    return () => {
      isCancelled = true;
      siblings.forEach((element) => element.removeAttribute('inert'));
    };
  });

  return {
    get occupied() {
      return occupied;
    },
    host: host.attach,
    scrim: scrim.attach,
    surfaces: surfaces.attach,
    dismissTop() {
      layers.dismissTop('blur');
    },
  };
}

/** What the nearest provider above renders: the toast queue its stack shows, if any. */
interface Hosted {
  toasts: unknown;
}

const HOSTED = defineContext<Hosted>('blade-overlay-hosted');

/** What a BladeProvider renders after its content. */
export interface OverlayHostClaim<S extends object> {
  /** The overlay host: no provider above, so this one hosts the page's overlays. */
  readonly host: boolean;
  /**
   * The queue its toast stack renders: a Blade queue (`createToasts()`) no
   * provider above renders. Undefined for none — the enclosing stack shows
   * it, or the app's own `Toasts` shows its toasts its own way.
   */
  readonly toasts: ToastQueue<S> | undefined;
}

/**
 * What a BladeProvider renders after its content: the overlay host when it
 * is the outermost provider, and a toast stack for a Blade queue no
 * provider above renders — so a nested provider with toasts of its own
 * shows them, in the enclosing host, and none shows a queue twice. Call
 * during component init.
 */
export function claimOverlayHost<S extends object>(toasts: Toasts<S>): OverlayHostClaim<S> {
  const above = HOSTED.get();
  const queue = queueOf(toasts);
  const renders = queue !== undefined && above?.toasts !== toasts;
  HOSTED.set({ toasts: renders ? toasts : above?.toasts });
  return { host: above === undefined, toasts: renders ? queue : undefined };
}
