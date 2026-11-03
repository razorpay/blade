import React from 'react';
import styled from 'styled-components';
import {
  chatInputBorderRadius,
  chatInputHoverGlowReach,
  chatInputHoverGlowSize,
} from './chatInputTokens';
import { useTheme } from '~components/BladeProvider';
import { makeBorderSize } from '~utils';

const StyledHoverRing = styled.div(({ theme }) => {
  const borderWidth = theme.border.width.thick;
  const primary = theme.colors.interactive.border.primary.default;
  return {
    position: 'absolute',
    // BaseInput draws its border as an outer box-shadow, so the ring sits just outside the box
    inset: makeBorderSize(-borderWidth),
    borderRadius: makeBorderSize(theme.border.radius[chatInputBorderRadius] + borderWidth),
    padding: makeBorderSize(borderWidth),
    pointerEvents: 'none',
    zIndex: 2,
    // an oval of primary blue centred on the pointer, fading out through the faded primary
    background: `radial-gradient(${chatInputHoverGlowSize.width / 2}px ${
      chatInputHoverGlowSize.height / 2
    }px at var(--chat-input-pointer-x, 50%) var(--chat-input-pointer-y, 50%), ${primary} 0%, ${primary} 42%, ${
      theme.colors.interactive.border.primary.faded
    } 70%, transparent 100%)`,
    // only the border ring shows; everything inside it is cut away
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
    // strength is written straight to the element as the pointer moves
    opacity: 0,
    '@media (forced-colors: active)': {
      display: 'none',
    },
  };
});

const smoothStep = (value: number): number => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

/**
 * Hover for ChatInput: instead of the whole border darkening, the border lights up only near the
 * pointer. The glow trails the pointer by `duration.2xquick` and fades in as the pointer comes
 * near the box, so it is already there when the pointer arrives. Position and strength are
 * written to the element directly, so moving the mouse never re-renders React. Touch is ignored,
 * and with reduced motion the glow follows the pointer without trailing.
 *
 * `isEnabled` turns the listener on (off while disabled). `isShown` lets the glow show (off while
 * focused, since focus already draws a blue border). `isPointerInside` tells the ambient border to
 * step aside.
 */
const useChatInputHoverBorder = ({
  isEnabled,
  isShown,
}: {
  isEnabled: boolean;
  isShown: boolean;
}): { hoverBorder: React.ReactElement; isPointerInside: boolean } => {
  const { theme } = useTheme();
  const followDuration = theme.motion.duration['2xquick'];
  const ringRef = React.useRef<HTMLDivElement>(null);
  const isShownRef = React.useRef(isShown);
  isShownRef.current = isShown;
  const animateRef = React.useRef<(() => void) | null>(null);
  const [isPointerInside, setIsPointerInside] = React.useState(false);

  React.useEffect(() => {
    const ring = ringRef.current;
    if (!isEnabled || !ring || typeof window === 'undefined') return undefined;
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const target = { x: 0, y: 0, strength: 0 };
    const current = { x: 0, y: 0, strength: 0, isPlaced: false };
    let frame = 0;
    let lastTime = 0;
    let isInside = false;

    const paint = (): void => {
      ring.style.setProperty('--chat-input-pointer-x', `${current.x}px`);
      ring.style.setProperty('--chat-input-pointer-y', `${current.y}px`);
      ring.style.opacity = String(current.strength);
    };

    const step = (time: number): void => {
      const elapsed = lastTime ? Math.min(100, time - lastTime) : 16;
      lastTime = time;
      const wantedStrength = isShownRef.current ? target.strength : 0;
      const ease = prefersReducedMotion ? 1 : 1 - Math.exp(-elapsed / followDuration);
      // a glow that is not showing jumps to the pointer, so it never slides in from elsewhere
      if (!current.isPlaced || current.strength < 0.02 || prefersReducedMotion) {
        current.x = target.x;
        current.y = target.y;
        current.isPlaced = true;
      } else {
        current.x += (target.x - current.x) * ease;
        current.y += (target.y - current.y) * ease;
      }
      current.strength += (wantedStrength - current.strength) * ease;
      const isSettled =
        Math.abs(wantedStrength - current.strength) < 0.01 &&
        Math.abs(target.x - current.x) < 0.5 &&
        Math.abs(target.y - current.y) < 0.5;
      if (isSettled) current.strength = wantedStrength;
      paint();
      if (isSettled) {
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = window.requestAnimationFrame(step);
    };

    const animate = (): void => {
      if (!frame) frame = window.requestAnimationFrame(step);
    };
    animateRef.current = animate;

    const setInside = (inside: boolean): void => {
      if (inside === isInside) return;
      isInside = inside;
      setIsPointerInside(inside);
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') return;
      const box = ring.getBoundingClientRect();
      target.x = event.clientX - box.left;
      target.y = event.clientY - box.top;
      const distanceX = Math.max(box.left - event.clientX, 0, event.clientX - box.right);
      const distanceY = Math.max(box.top - event.clientY, 0, event.clientY - box.bottom);
      const distance = Math.hypot(distanceX, distanceY);
      target.strength =
        distance <= chatInputHoverGlowReach.full
          ? 1
          : 1 -
            smoothStep((distance - chatInputHoverGlowReach.full) / chatInputHoverGlowReach.fade);
      setInside(distance === 0);
      animate();
    };

    const handlePointerLeave = (): void => {
      target.strength = 0;
      setInside(false);
      animate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      animateRef.current = null;
      ring.style.opacity = '0';
      setIsPointerInside(false);
    };
  }, [isEnabled, followDuration]);

  // fade the glow out on focus, and back in on blur if the pointer is still near
  React.useEffect(() => {
    animateRef.current?.();
  }, [isShown]);

  return {
    hoverBorder: (
      <StyledHoverRing
        ref={ringRef}
        aria-hidden="true"
        data-blade-component="chat-input-hover-border"
      />
    ),
    isPointerInside,
  };
};

export { useChatInputHoverBorder };
