import { getLayers } from '../layer/layers';
import type { Layers } from '../layer/layers';

/** A tooltip in a group: what the group needs to close it. */
export interface TooltipGroupMember {
  /** Closes it at once, with no delay. */
  close(): void;
}

/**
 * Blade's tooltip delay group (React's `FloatingDelayGroup` in
 * BladeProvider): once one tooltip is open, the next opens with no delay
 * and the open one closes at once, so the pointer sweeps along a row of
 * them. The delay comes back once none is open.
 */
export interface TooltipGroup {
  /** A tooltip other than `member` is open: `member` opens with no delay. */
  isInstant(member: TooltipGroupMember): boolean;
  /** `member` opened: the one open before it closes. */
  opened(member: TooltipGroupMember): void;
  closed(member: TooltipGroupMember): void;
}

export function createTooltipGroup(): TooltipGroup {
  let current: TooltipGroupMember | undefined;
  return {
    isInstant: (member) => current !== undefined && current !== member,
    opened(member) {
      const previous = current;
      current = member;
      if (previous && previous !== member) {
        previous.close();
      }
    },
    closed(member) {
      if (current === member) {
        current = undefined;
      }
    },
  };
}

// One group per layer stack: per BladeProvider that brings its own layers,
// else the page's. Keyed off the layers, so BladeProvider wires nothing.
const groups = new WeakMap<Layers, TooltipGroup>();

/** The group the tooltips under the nearest layer stack share. Call during component init. */
export function getTooltipGroup(): TooltipGroup {
  const layers = getLayers();
  let group = groups.get(layers);
  if (!group) {
    group = createTooltipGroup();
    groups.set(layers, group);
  }
  return group;
}
