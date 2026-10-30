import React from 'react';
import styled from 'styled-components';
import { chatInputBorderRadius, chatInputHoverGlowRadius } from './chatInputTokens';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';

const StyledHoverRing = styled.div<{ $isShown: boolean }>(({ theme, $isShown }) => {
  const borderWidth = theme.border.width.thin;
  return {
    position: 'absolute',
    // BaseInput draws its border as an outer box-shadow, so the ring sits just outside the box
    inset: makeBorderSize(-borderWidth),
    borderRadius: makeBorderSize(theme.border.radius[chatInputBorderRadius] + borderWidth),
    padding: makeBorderSize(borderWidth),
    pointerEvents: 'none',
    zIndex: 2,
    // a soft spot of primary blue, centred on the pointer
    background: `radial-gradient(${chatInputHoverGlowRadius}px circle at var(--chat-input-pointer-x, 50%) var(--chat-input-pointer-y, 50%), ${theme.colors.interactive.border.primary.default} 0%, ${theme.colors.interactive.border.primary.default} 35%, transparent 75%)`,
    // only the border ring shows; everything inside it is cut away
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
    opacity: $isShown ? 1 : 0,
    transitionProperty: 'opacity',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
    '@media (forced-colors: active)': {
      display: 'none',
    },
  };
});

/**
 * Hover for ChatInput: instead of the whole border darkening, the border darkens only near the
 * pointer and the spot follows it around the box. The pointer position is written to CSS
 * variables, so moving the mouse never re-renders React.
 */
const useChatInputHoverBorder = (): {
  hoverBorder: React.ReactElement;
  hoverHandlers: {
    onMouseEnter: React.MouseEventHandler<HTMLElement>;
    onMouseMove: React.MouseEventHandler<HTMLElement>;
    onMouseLeave: React.MouseEventHandler<HTMLElement>;
  };
} => {
  const ringRef = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const movePointer = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const ring = ringRef.current;
    if (!ring) return;
    const box = ring.getBoundingClientRect();
    ring.style.setProperty('--chat-input-pointer-x', `${event.clientX - box.left}px`);
    ring.style.setProperty('--chat-input-pointer-y', `${event.clientY - box.top}px`);
  }, []);

  return {
    hoverBorder: (
      <StyledHoverRing
        ref={ringRef}
        $isShown={isHovered}
        aria-hidden="true"
        data-blade-component="chat-input-hover-border"
      />
    ),
    hoverHandlers: {
      onMouseEnter: (event) => {
        movePointer(event);
        setIsHovered(true);
      },
      onMouseMove: movePointer,
      onMouseLeave: () => setIsHovered(false),
    },
  };
};

export { useChatInputHoverBorder };
