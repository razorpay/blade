import type { Placement } from '../../runes/layer/placement';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The parts of a Popover. On web the panel is measured and placed by
 * PopoverPanel (inline left/top) inside the LayerHost; native cannot measure
 * into a host and places it with `nativePlacement` classes inside the root.
 * Enter/exit ride the panel's `data-state`, as everywhere.
 */
export interface PopoverClasses {
  /** Wraps the trigger; `class` from the caller lands here. */
  root: string;
  /** The floating element. */
  panel: string;
  /** Native only: applied to the panel per requested placement. */
  nativePlacement: Record<Placement, string>;
  /** Distance between the trigger and the panel, in px. */
  gap: number;
}

export type PopoverStyleResolver<P> = (props: P) => PopoverClasses;

/** One look: no style axes yet. */
export type PopoverStyleProps = Record<never, never>;
export const POPOVER_AXES = {} as const;

export const POPOVER_PANEL =
  'pointer-events-auto absolute z-50 rounded-small border-thin border-solid border-popup-gray-subtle bg-popup-gray-moderate text-surface-gray-normal shadow-midRaised backdrop-blur-high outline-none transition-all duration-xquick ease-entrance data-[state=closed]:scale-95 data-[state=closed]:opacity-0 motion-reduce:transition-none';

export const resolvePopover: PopoverStyleResolver<PopoverStyleProps> = () => ({
  root: 'relative inline-flex',
  panel: `${POPOVER_PANEL} w-max max-w-80 p-4`,
  nativePlacement: NATIVE_PLACEMENT,
  gap: 8,
});
