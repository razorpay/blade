import { tick } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { defineContext } from '../context';
import { createNodeRef } from '../dom/node.svelte';
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

const HOSTED = defineContext<true>('blade-overlay-hosted');

/**
 * Whether this BladeProvider renders the overlay host: it does when no
 * provider above does. Call during component init.
 */
export function claimOverlayHost(): boolean {
  const isHost = HOSTED.get() === undefined;
  HOSTED.set(true);
  return isHost;
}
