import type { TransitionConfig } from 'svelte/transition';

function toMs(list: string): number[] {
  return list.split(',').map((part) => parseFloat(part) * 1000 || 0);
}

export function longestTransition(
  elements: Array<HTMLElement | undefined>
): number {
  let longest = 0;
  for (const element of elements) {
    if (element) {
      const style = getComputedStyle(element);
      const delays = toMs(style.transitionDelay);
      toMs(style.transitionDuration).forEach((duration, i) => {
        longest = Math.max(longest, duration + (delays[i] ?? delays[0] ?? 0));
      });
    }
  }
  return longest;
}

/**
 * A `transition:` whose work runs once the block toggles: Svelte calls it
 * with `{ direction }`, which its `() => TransitionConfig` type leaves out.
 * `run` sets the node up for the phase and returns how long it animates.
 */
export function phaseTransition(
  run: (node: HTMLElement, phase: 'in' | 'out') => number
): (node: HTMLElement) => () => TransitionConfig {
  return (node) => {
    const deferred = ({ direction }: { direction: 'in' | 'out' | 'both' }) => ({
      duration: run(node, direction === 'out' ? 'out' : 'in'),
    });
    return deferred as unknown as () => TransitionConfig;
  };
}

/**
 * Presence for overlays. Svelte owns it — the node stays mounted until the
 * outro ends and an interrupted intro reverses — while the visuals stay the
 * component's CSS transitions: this only flips `data-state` on the node and
 * reports how long `animated` take to finish.
 *
 * `transition` goes on the node as `transition:`. `mount` goes on it as an
 * attachment, and is what opens a node whose intro Svelte does not play: a
 * local transition runs only when its own block toggles, so a surface that
 * is already open when a parent block creates it (every modal the
 * ModalStack renders) would stay `closed` for good.
 * Web only (computed styles); native twins never import it.
 */
export function createPresence(
  animated: (node: HTMLElement) => Array<HTMLElement | undefined>
) {
  let wanted: 'open' | 'closed' | undefined;

  // Next frame, so the closed style is computed before it flips — and read
  // then, so a close that came in the meantime wins.
  function openNextFrame(node: HTMLElement) {
    requestAnimationFrame(() => {
      if (wanted === 'open') {
        node.dataset.state = 'open';
      }
    });
  }

  return {
    transition: phaseTransition((node, phase) => {
      wanted = phase === 'out' ? 'closed' : 'open';
      if (wanted === 'closed') {
        node.dataset.state = wanted;
      } else {
        openNextFrame(node);
      }
      return longestTransition(animated(node));
    }),
    mount: (node: HTMLElement) => {
      if (wanted === undefined) {
        wanted = 'open';
        openNextFrame(node);
      }
      return () => {
        wanted = undefined;
      };
    },
  };
}
