import styled from 'styled-components';
import React from 'react';
import type { CardRootProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';

const StyledCardRoot = styled(BaseBox)<CardRootProps & { isPressed: boolean; isMobile: boolean }>(
  ({ theme, isSelected, isFocused, scaleOnHover, isPressed, isMobile }) => {
    const selectedColor = isSelected ? theme.colors.brand.primary[500] : 'transparent';
    const selectedRing = `0px 0px 0px ${theme.border.width.thick}px ${selectedColor}`;
    //  focused state
    const focusRing = isFocused ? `, 0px 0px 0px 4px ${theme.colors.brand.primary[400]}` : '';

    return {
      // Selected state
      // TODO: use thicker
      boxShadow: `${selectedRing}${focusRing}`,
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
      transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
      transitionProperty: 'transform, box-shadow',

      // pressed state for mobile only
      ...(isMobile &&
        isPressed && {
          transform: 'scale(0.95)',
        }),

      // Hover state for desktop only
      ...(!isMobile &&
        scaleOnHover && {
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }),

      // uplift all the nested links so they receive clicks and events (except the LinkOverlay)
      // https://www.sarasoueidan.com/blog/nested-links
      '& a[href]:not(a[data-blade-component="card-link-overlay"])': {
        zIndex: 1,
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
      isPressed={isPressed}
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
