import type { Attachment } from 'svelte/attachments';
import { createNodeRef } from '../dom/node.svelte';
import { getLayers } from './layers';

export interface LayerHost {
  /** Whether a surface is open. */
  readonly occupied: boolean;
  /** On the host element. */
  readonly host: Attachment<HTMLDivElement>;
  /** On the one scrim under every open modal (web). */
  readonly scrim: Attachment<HTMLDivElement>;
  /** On the box modal surfaces render into (web). */
  readonly surfaces: Attachment<HTMLDivElement>;
  /** The scrim was tapped. */
  dismissTop(): void;
}

/**
 * Registers the host element and its parts with the layers for as long as
 * they are mounted. With `isolates`, everything beside the host goes inert
 * while a surface is open. Call during component initialisation.
 */
export function createLayerHost(options: { isolates: boolean }): LayerHost {
  const layers = getLayers();
  const host = createNodeRef<HTMLDivElement>();
  const scrim = createNodeRef<HTMLDivElement>();
  const surfaces = createNodeRef<HTMLDivElement>();
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
  $effect(() => {
    const node = host.current;
    if (!options.isolates || !node || !occupied) {
      return undefined;
    }
    const siblings = Array.from(node.parentElement?.children ?? []).filter(
      (element) => element !== node && !element.hasAttribute('inert'),
    );
    siblings.forEach((element) => element.setAttribute('inert', ''));
    return () => {
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
