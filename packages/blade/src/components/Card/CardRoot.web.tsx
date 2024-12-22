import styled from 'styled-components';
import React from 'react';
import type { CardRootProps } from './types';
import { CARD_LINK_OVERLAY_ID, CARD_SCALE_DOWN_VALUE, CARD_SCALE_UP_VALUE } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import type { BladeElementRef } from '~utils/types';

const StyledCardRoot = styled(BaseBox)<CardRootProps & { isPressed: boolean; isMobile: boolean }>(
  ({ as, theme, isSelected, isFocused, shouldScaleOnHover, isPressed, isMobile }) => {
    const selectedColor = isSelected ? theme.colors.surface.border.primary.normal : 'transparent';
    const selectedBorder = `0px 0px 0px ${theme.border.width.thicker}px ${selectedColor}`;
    //  focused state
    const focusRing = isFocused
      ? `, 0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`
      : '';

    return {
      // Selected state
      boxShadow: `${selectedBorder}${focusRing}`,
      cursor: as === 'label' ? 'pointer' : 'initial',

      // pressed state for mobile only
      ...(isMobile &&
        isPressed && {
          transform: `scale(${CARD_SCALE_DOWN_VALUE})`,
        }),

      // Hover state for desktop only
      ...(!isMobile &&
        shouldScaleOnHover && {
          transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
          transitionTimingFunction: castWebType(theme.motion.easing.standard),
          transitionProperty: 'transform, box-shadow',

          '&:hover': {
            transform: `scale(${CARD_SCALE_UP_VALUE})`,
          },
        }),

      // uplift all the nested links so they receive clicks and events (except the LinkOverlay)
      // https://www.sarasoueidan.com/blog/nested-links
      [`& a[href]:not(a[data-blade-component="${CARD_LINK_OVERLAY_ID}"])`]: {
        zIndex: 2,
        position: 'relative',
      },
      [`& button:not(button[data-blade-component="${CARD_LINK_OVERLAY_ID}"])`]: {
        zIndex: 2,
        position: 'relative',
      },
    };
  },
);

const _CardRoot: React.ForwardRefRenderFunction<BladeElementRef, CardRootProps> = (
  { as, accessibilityLabel, children, ...props },
  ref,
): React.ReactElement => {
  const isMobile = useIsMobile();
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <StyledCardRoot
      ref={ref as never}
      as={as}
      {...props}
      isMobile={isMobile}
      isPressed={props.shouldScaleOnHover ? isPressed : false}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      {...makeAccessible({
        label: as === 'label' ? accessibilityLabel : undefined,
      })}
    >
      {children}
    </StyledCardRoot>
  );
};

const CardRoot = React.forwardRef(_CardRoot);

export { CardRoot };
