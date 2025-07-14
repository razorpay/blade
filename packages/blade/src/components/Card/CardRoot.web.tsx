import styled from 'styled-components';
import React from 'react';
import type { CardRootProps } from './types';
import { CARD_LINK_OVERLAY_ID, CARD_SCALE_DOWN_VALUE, CARD_SCALE_UP_VALUE } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, getMediaQuery, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import type { BladeElementRef } from '~utils/types';

const StyledCardRoot = styled(BaseBox)<CardRootProps>(({ as, theme, shouldScaleOnHover }) => {
  // const selectedColor = isSelected ? theme.colors.surface.border.primary.normal : 'transparent';
  // const selectedBorder = `0px 0px 0px ${theme.border.width.thicker}px ${selectedColor}`;

  return {
    // Selected state
    // boxShadow: selectedBorder,
    cursor: as === 'label' ? 'pointer' : 'initial',

    // // Focus state using CSS :focus-within
    // '&:focus-within': {
    //   boxShadow: `${selectedBorder}, 0px 0px 0px 4px ${theme.colors.surface.border.primary.muted}`,
    // },
    ...(shouldScaleOnHover && {
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
      transitionTimingFunction: castWebType(theme.motion.easing.standard),
      transitionProperty: 'transform',

      // mobile transform
      '&:active': {
        transform: `scale(${CARD_SCALE_DOWN_VALUE})`,
      },
      [`@media ${getMediaQuery({ min: theme.breakpoints.m })}`]: {
        // desktop transform
        '&:hover': {
          transform: `scale(${CARD_SCALE_UP_VALUE})`,
        },
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
    [`& label:not(a[data-blade-component="${CARD_LINK_OVERLAY_ID}"])`]: {
      zIndex: 2,
      position: 'relative',
    },
    [`& label:not(button[data-blade-component="${CARD_LINK_OVERLAY_ID}"])`]: {
      zIndex: 2,
      position: 'relative',
    },
  };
});

const _CardRoot: React.ForwardRefRenderFunction<BladeElementRef, CardRootProps> = (
  { as, accessibilityLabel, children, ...props },
  ref,
): React.ReactElement => {
  return (
    <StyledCardRoot
      ref={ref as never}
      as={as}
      {...props}
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
