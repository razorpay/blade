import type { Component, Snippet } from 'svelte';
import type { AxisValue } from '../../axes';
import type { Placement, PlacementSide } from '../../runes/layer/placement';
import { floatingOverlayClasses } from '../modal/styles';
import type { FloatingOverlayClasses, ModalBehaviourProps } from '../modal/styles';
import type { OverlaySectionsProps } from '../modal/sections';

/** The blade taxonomy as data. */
export const POPOVER_AXES = {
  padding: ['default', 'none'],
} as const;

type Axis<K extends keyof typeof POPOVER_AXES> = AxisValue<typeof POPOVER_AXES, K>;

/** Derived from POPOVER_AXES: add a value there, never here. */
export interface PopoverStyleProps {
  /** `none`: a bare body the content fills, edge to edge. @default 'default' */
  padding?: Axis<'padding'>;
}

/**
 * Blade's Popover: a non-modal panel by its trigger with an arrow toward it,
 * 16px round, at most 288px wide (328px on desktop). Escape and a press
 * outside dismiss it; the page stays live, with no scrim.
 */
export type PopoverBehaviourProps = Omit<
  ModalBehaviourProps,
  'children' | 'classes' | 'initialFocusRef'
> &
  Omit<OverlaySectionsProps, 'children'> & {
    /**
     * The trigger: the control the panel hangs from, a Button or an
     * IconButton. The wrapper opens it on a click, so it wires nothing;
     * `isOpen` is there to read (a chevron that flips).
     */
    children: Snippet<[{ isOpen: boolean }]>;
    /** The trigger does not open it. @default false */
    isDisabled?: boolean;
    /**
     * Raw content, in place of the sections (`body`, `footer`): no
     * container, no padding — it owns its box. `close` closes without a
     * dismissal.
     */
    content?: Snippet<[{ close: () => void }]>;
    /**
     * Where the panel sits against its trigger.
     * @default 'top'
     */
    placement?: Placement;
    /**
     * Takes focus when it opens, in place of its first control (the close
     * button): an element inside it, bound with `bind:this`.
     */
    initialFocusRef?: HTMLElement | null;
  };

export type PopoverComponent = Component<PopoverBehaviourProps & PopoverStyleProps>;

// Blade's PopoverContentWrapper: the popup fill, 16px round, the popup
// shadow (a 1px rim drawn inside over the raised shadow), the high backdrop
// blur; 328px at most (288px on phones). Only opacity and scale animate:
// `left`/`top` land once measured and must not slide in from the corner.
const PANEL =
  'pointer-events-auto absolute z-50 flex flex-col rounded-large bg-popup-gray-moderate text-surface-gray-normal shadow-dropdown backdrop-blur-high outline-none [transition-property:opacity,transform] duration-xquick ease-entrance data-[state=closed]:scale-95 data-[state=closed]:opacity-0 motion-reduce:transition-none';

// Blade's popover arrow: 22×12, pointing at the trigger from the panel's
// facing edge, in the panel's fill; the panel sits 4px past its tip.
const ARROW = 'absolute bg-popup-gray-moderate';
const ARROW_SIDE: Record<PlacementSide, string> = {
  top:
    'top-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(0_0,100%_0,50%_100%)]',
  bottom:
    'bottom-full w-[22px] h-3 [left:var(--popover-arrow)] -translate-x-1/2 [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  left:
    'left-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(0_0,100%_50%,0_100%)]',
  right:
    'right-full w-3 h-[22px] [top:var(--popover-arrow)] -translate-y-1/2 [clip-path:polygon(100%_0,100%_100%,0_50%)]',
};

/** Blade's Popover panel, with its arrow toward the trigger. */
export function resolvePopover(): FloatingOverlayClasses {
  return floatingOverlayClasses({
    panel: `${PANEL} w-max max-w-[288px] d:max-w-[328px]`,
    gap: 16,
    arrow: ARROW,
    arrowSide: ARROW_SIDE,
  });
}
