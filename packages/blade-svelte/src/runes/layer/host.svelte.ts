import type { Attachment } from 'svelte/attachments';
import { defineContext } from '../context';
import { createNodeRef } from '../dom/node.svelte';
import { getLayers } from './layers';

export interface OverlayHost {
  /**
   * Whether a modal surface is open: the provider's content goes inert, so
   * focus, clicks and the screen reader's cursor stay in the surface.
   */
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
 * with the layers for as long as they are mounted. `occupied` is what makes
 * the provider's content inert. Call during component initialisation.
 */
export function createOverlayHost(): OverlayHost {
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
