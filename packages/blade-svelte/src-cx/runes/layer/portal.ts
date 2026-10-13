import type { Attachment } from 'svelte/attachments';

/**
 * Moves the node into `target()` — the LayerHost, so scroll and overflow
 * cannot clip it — and leaves it in place when there is none. With
 * `removesItself` it also leaves the target by its own hand on teardown:
 * moved out of the branch Svelte made it in, Svelte's teardown may no
 * longer find it there.
 */
export function portal(
  target: () => Element | undefined,
  options: { removesItself?: boolean } = {},
): Attachment<HTMLElement> {
  return (node) => {
    target()?.appendChild(node);
    return options.removesItself ? () => node.remove() : undefined;
  };
}
