/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useEffect, useRef } from 'react';

type UseScrollLockProps = {
  targetRef: React.RefObject<Element>;
  enabled: boolean;
  reserveScrollBarGap: boolean;
};

/**
 * Handle scroll locking to ensure a good dragging experience on Android and iOS.
 *
 * On iOS the following may happen if scroll isn't locked:
 * - When dragging the sheet the background gets dragged at the same time.
 * - When dragging the page scroll is also affected, causing the drag to feel buggy and "slow".
 *
 * On Android it causes the chrome toolbar to pop down as you drag down, and hide as you drag up.
 * When it's in between two toolbar states it causes the framerate to drop way below 60fps on
 * the bottom sheet drag interaction.
 */
export function useScrollLock({
  targetRef,
  enabled,
  reserveScrollBarGap,
}: UseScrollLockProps): React.MutableRefObject<{
  activate: () => void;
  deactivate: () => void;
}> {
  const ref = useRef<{ activate: () => void; deactivate: () => void }>({
    activate: () => {
      throw new TypeError('Tried to activate scroll lock too early');
    },
    deactivate: () => {},
  });

  useEffect(() => {
    if (!enabled) {
      ref.current.deactivate();
      ref.current = { activate: () => {}, deactivate: () => {} };
      return;
    }

    const target = targetRef.current;
    let active = false;

    ref.current = {
      activate: () => {
        if (active) return;
        active = true;
        if (!target) return;
        disableBodyScroll(target, {
          allowTouchMove: (el: any) => el.closest('[data-body-scroll-lock-ignore]'),
          reserveScrollBarGap,
        });
      },
      deactivate: () => {
        if (!active) return;
        active = false;
        if (!target) return;
        enableBodyScroll(target);
      },
    };
  }, [enabled, targetRef, reserveScrollBarGap]);

  return ref;
}
