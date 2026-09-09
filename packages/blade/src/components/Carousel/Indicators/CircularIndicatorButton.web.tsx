import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { IndicatorButtonProps } from './types';
import { CAROUSEL_AUTOPLAY_INTERVAL } from '../constants';
import { metaAttribute } from '~utils/metaAttribute';
import { useTheme } from '~components/BladeProvider';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const DOT_RADIUS = 3;
const RING_GAP = 1;
const RING_STROKE_WIDTH = 2;
const RING_RADIUS = DOT_RADIUS + RING_GAP + RING_STROKE_WIDTH / 2;
const SVG_SIZE = (RING_RADIUS + RING_STROKE_WIDTH / 2) * 2;
const CENTER = SVG_SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const progressAnimation = keyframes`
  from {
    stroke-dashoffset: ${CIRCUMFERENCE};
  }
  to {
    stroke-dashoffset: 0;
  }
`;

const ProgressRing = styled.circle<{ $animate: boolean }>`
  stroke-dashoffset: ${CIRCUMFERENCE};
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${progressAnimation} ${CAROUSEL_AUTOPLAY_INTERVAL}ms linear forwards;
    `}
`;

const StyledCircularButton = styled.button(({ theme }) => ({
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: `${SVG_SIZE}px`,
  minHeight: `${SVG_SIZE}px`,
  position: 'relative' as const,
  '&:focus-visible': {
    ...getFocusRingStyles({ theme }),
    borderRadius: theme.border.radius.max,
  },
}));

type CircularIndicatorButtonProps = IndicatorButtonProps & {
  isAutoPlaying?: boolean;
};

const CircularIndicatorButton = ({
  onClick,
  isActive,
  variant,
  isAutoPlaying,
  slideIndex: _slideIndex,
  ...rest
}: CircularIndicatorButtonProps): React.ReactElement => {
  const { theme } = useTheme();

  const activeColor = {
    gray: theme.colors.interactive.icon.gray.muted,
    white: theme.colors.interactive.icon.staticWhite.normal,
    blue: theme.colors.interactive.icon.primary.subtle,
  };

  const inactiveColor = theme.colors.overlay.background.moderate;
  const fillColor = isActive ? activeColor[variant] : inactiveColor;
  const showProgressRing = isActive && isAutoPlaying;

  return (
    <StyledCircularButton
      onClick={onClick}
      {...rest}
      {...metaAttribute({ name: 'carousel-indicator-button' })}
    >
      <svg
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        style={{ display: 'block' }}
      >
        <circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} fill={fillColor} stroke="none" />
        {isActive && (
          <ProgressRing
            $animate={Boolean(showProgressRing)}
            cx={CENTER}
            cy={CENTER}
            r={RING_RADIUS}
            fill="none"
            stroke={showProgressRing ? activeColor[variant] : 'transparent'}
            strokeWidth={RING_STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        )}
      </svg>
    </StyledCircularButton>
  );
};

export { CircularIndicatorButton };
export type { CircularIndicatorButtonProps };
