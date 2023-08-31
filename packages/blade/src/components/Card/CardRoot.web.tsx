import styled from 'styled-components';
import React from 'react';
import type { CardRootProps } from './types';
import { CARD_LINK_OVERLAY_ID, CARD_SCALE_DOWN_VALUE, CARD_SCALE_UP_VALUE } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';

const StyledCardRoot = styled(BaseBox)<CardRootProps & { isPressed: boolean; isMobile: boolean }>(
  ({ theme, isSelected, isFocused, shouldScaleOnHover, isPressed, isMobile }) => {
    const selectedColor = isSelected ? theme.colors.brand.primary[500] : 'transparent';
    const selectedBorder = `0px 0px 0px ${theme.border.width.thicker}px ${selectedColor}`;
    //  focused state
    const focusRing = isFocused ? `, 0px 0px 0px 4px ${theme.colors.brand.primary[400]}` : '';

    return {
      // Selected state
      boxShadow: `${selectedBorder}${focusRing}`,
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
      transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
      transitionProperty: 'transform, box-shadow',

      // pressed state for mobile only
      ...(isMobile &&
        isPressed && {
          transform: `scale(${CARD_SCALE_DOWN_VALUE})`,
        }),

      // Hover state for desktop only
      ...(!isMobile &&
        shouldScaleOnHover && {
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

const CardRoot = ({
  as,
  accessibilityLabel,
  children,
  ...props
}: CardRootProps): React.ReactElement => {
  const isMobile = useIsMobile();
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <StyledCardRoot
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

export { CardRoot };
