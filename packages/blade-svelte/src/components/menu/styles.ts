import type { Component, Snippet } from 'svelte';
import type { Placement } from '../../runes/layer/placement';
import { floatingOverlayClasses } from '../modal/styles';
import type { FloatingOverlayClasses, ModalBehaviourProps } from '../modal/styles';
import { MENU_SURFACE, POPUP_GAP } from '../shared/popup-list';
import type { OverlaySectionsProps } from '../modal/sections';

/** Blade's Menu has one look: no style axes. */
export type MenuStyleProps = Record<never, never>;

/**
 * Blade's Menu look: the panel by its trigger, 12px round, 240 to 400px
 * wide, with no close button; ArrowDown or ArrowUp on the closed trigger
 * opens it. A dialog holding what the app puts in it — an ActionList whose
 * onPick calls the body's close.
 */
export type MenuBehaviourProps = Omit<
  ModalBehaviourProps,
  'children' | 'classes' | 'role' | 'closeLabel' | 'initialFocusRef'
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
     * @default 'bottom-start'
     */
    placement?: Placement;
  };

export type MenuComponent = Component<MenuBehaviourProps & MenuStyleProps>;

/** Figma's Menu panel, 12px round, 8px from its trigger. */
export function resolveMenu(): FloatingOverlayClasses {
  return floatingOverlayClasses({ panel: MENU_SURFACE, gap: POPUP_GAP });
}
