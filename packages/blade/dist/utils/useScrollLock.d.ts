import { default as React } from 'react';
type UseScrollLockProps = {
    targetRef?: React.RefObject<Element>;
    enabled: boolean;
    reserveScrollBarGap: boolean;
};
type ScrollLockMethods = {
    activate: () => void;
    deactivate: () => void;
    active: React.MutableRefObject<boolean>;
};
/**
 * Modified from: https://github.com/stipsan/react-spring-bottom-sheet/blob/main/src/hooks/useScrollLock.tsx
 * Handle scroll locking to ensure a good dragging experience on Android and iOS.
 *
 * On iOS the following may happen if scroll isn't locked:
 * - When dragging the sheet the background gets dragged at the same time.
 * - When dragging the page scroll is also affected, causing the drag to feel buggy and "slow".
 *
 * On Android it causes the chrome toolbar to pop down as you drag down, and hide as you drag up.
 * When it's in between two toolbar states it causes the framerate to drop way below 60fps on
 * the bottom sheet drag interaction.
 *
 * This hook does two things
 * - Provides a imparative API to activate and deactivate the body scroll lock
 * - And ensures the activation and deactivation doesn't happen twice for a single target
 */
export declare function useScrollLock({ targetRef, enabled, reserveScrollBarGap, }: UseScrollLockProps): React.MutableRefObject<ScrollLockMethods>;
export {};
