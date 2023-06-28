/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import React from 'react';

type UseScrollLockProps = {
  targetRef: React.RefObject<Element>;
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
export function useScrollLock({
  targetRef,
  enabled,
  reserveScrollBarGap,
}: UseScrollLockProps): React.MutableRefObject<ScrollLockMethods> {
  const active = React.useRef(false);
  // Imparative functions which users can call
  const ref = React.useRef<ScrollLockMethods>({
    activate: () => {
      throw new TypeError('Tried to activate scroll lock too early');
    },
    deactivate: () => {},
    active,
  });

  React.useEffect(() => {
    // if it's disabled we just return NOOP, so the functions do nothing even if called.
    if (!enabled) {
      ref.current = { activate: () => {}, deactivate: () => {}, active };
      return;
    }

    const target = targetRef.current;
    active.current = false;

    ref.current = {
      activate: () => {
        // if we are already active do nothig
        if (active.current) return;
        // if not, set the active=true so next time this is called we know it's true
        active.current = true;
        if (!target) return;
        disableBodyScroll(target, {
          allowTouchMove: (el: any) => el.closest('[data-body-scroll-lock-ignore]'),
          reserveScrollBarGap,
        });
      },
      deactivate: () => {
        // only deactivate if we are active
        if (!active.current) return;
        active.current = false;
        if (!target) return;
        enableBodyScroll(target);
      },
      active,
    };
  }, [enabled, targetRef, reserveScrollBarGap]);

  return ref;
}
