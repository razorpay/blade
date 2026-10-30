import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { chatInputAmbientBorderLoopDuration, chatInputBorderRadius } from './chatInputTokens';
import { useTheme } from '~components/BladeProvider';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';

// The streak is a dash on an SVG copy of the box's rounded outline. Lengths are in `pathLength`
// units (the whole outline is 100), so the streak is the same share of the outline at any size
// and it can only ever sit on the edge it is passing.
const OUTLINE_LENGTH = 100;

// Raising the dash offset moves the dash back towards the start of the path: counterclockwise,
// right to left along the top edge.
const travel = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: ${OUTLINE_LENGTH}; }
`;

const StyledRing = styled.div(({ theme }) => {
  const borderWidth = theme.border.width.thin;
  return {
    position: 'absolute',
    // BaseInput draws its border as an outer box-shadow, so the ring sits just outside the box
    inset: makeBorderSize(-borderWidth),
    borderRadius: makeBorderSize(theme.border.radius[chatInputBorderRadius] + borderWidth),
    padding: makeBorderSize(borderWidth),
    pointerEvents: 'none',
    zIndex: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface.background.gray.intense,
    // only the border ring shows; everything inside it is cut away
    WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
    '@media (forced-colors: active)': {
      display: 'none',
    },
  };
});

const StyledBaseColor = styled.div<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  position: 'absolute',
  inset: 0,
  backgroundColor: $isActive
    ? theme.colors.interactive.border.primary.default
    : theme.colors.interactive.border.primary.faded,
  transitionProperty: 'background-color',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.moderate)),
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
}));

const StyledStreak = styled.svg<{ $isShown: boolean }>(
  ({ theme, $isShown }) => css`
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    opacity: ${$isShown ? 1 : 0};
    transition-property: opacity;
    transition-duration: ${castWebType(makeMotionTime(theme.motion.duration.moderate))};
    transition-timing-function: ${castWebType(theme.motion.easing.standard)};

    rect {
      animation: ${travel} ${chatInputAmbientBorderLoopDuration}ms linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  `,
);

type StreakLayer = { length: number; color: string; opacity: number };

// How many layers make up the fade, and how long the streak is (in outline units)
const STREAK_STEPS = 24;
const STREAK_LENGTH = 20;

/**
 * Layers that fade linearly from the head to the tail. Layer `j` (of N, longest first) covers the
 * last `j/N` of the streak. Giving it opacity `1 / (N - j + 1)` makes the stacked opacity rise by
 * exactly `1/N` per step, so the fade is a straight line from nothing at the tail to full at the
 * head.
 */
const getFadeLayers = (color: string): StreakLayer[] =>
  Array.from({ length: STREAK_STEPS }, (_, index) => {
    const step = index + 1;
    return {
      length: (STREAK_LENGTH * (STREAK_STEPS - step + 1)) / STREAK_STEPS,
      color,
      opacity: 1 / (STREAK_STEPS - step + 1),
    };
  });

// Layers share their leading end, so they stack up towards the head of the streak.
const Streak = ({
  layers,
  isShown,
  radius,
  strokeWidth,
}: {
  layers: StreakLayer[];
  isShown: boolean;
  radius: number;
  strokeWidth: number;
}): React.ReactElement => (
  <StyledStreak $isShown={isShown} aria-hidden="true" focusable="false">
    {layers.map(({ length, color, opacity }) => (
      <rect
        key={length}
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={radius}
        ry={radius}
        pathLength={OUTLINE_LENGTH}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        // centred on the edge: the inner half is the visible ring, the outer half is cut away
        strokeWidth={strokeWidth}
        strokeDasharray={`${length} ${OUTLINE_LENGTH - length}`}
      />
    ))}
  </StyledStreak>
);

/**
 * The ambient border. At rest: a soft blue border with a brighter blue streak. While the cursor is
 * in the box: a full blue border with a soft white shine. The streak keeps its place when the
 * colours change, and goes once around the box about every 12 seconds. With reduced motion nothing
 * moves.
 */
const ChatInputAmbientBorder = ({ isActive }: { isActive: boolean }): React.ReactElement => {
  const { theme } = useTheme();
  const radius = theme.border.radius[chatInputBorderRadius] + theme.border.width.thin;
  const strokeWidth = theme.border.width.thin * 2;
  const primary = theme.colors.interactive.border.primary.default;
  // a light white glaze over the blue (32% white), so the shine reads as a lighter blue, not white
  const shineCore = theme.colors.interactive.border.staticWhite.fadedHighlighted;

  return (
    <StyledRing aria-hidden="true" data-blade-component="chat-input-ambient-border">
      <StyledBaseColor $isActive={isActive} />
      <Streak
        isShown={!isActive}
        radius={radius}
        strokeWidth={strokeWidth}
        layers={getFadeLayers(primary)}
      />
      <Streak
        isShown={isActive}
        radius={radius}
        strokeWidth={strokeWidth}
        layers={getFadeLayers(shineCore)}
      />
    </StyledRing>
  );
};

export { ChatInputAmbientBorder };
