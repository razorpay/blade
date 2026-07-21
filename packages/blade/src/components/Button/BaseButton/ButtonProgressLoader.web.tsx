/* eslint-disable react/no-unused-prop-types */
import styled, { css, keyframes } from 'styled-components';
import type { ButtonCornerRadii } from './types';

type ButtonProgressLoaderProps = {
  duration: number;
  restColor: string;
  surfaceColor: string;
  borderRadius: number;
  borderRadii?: ButtonCornerRadii;
  frameBoxShadow?: string;
  shadowHighlightColor?: string;
  shadowHighlightHeight?: number;
  shadowBottomColor?: string;
  shadowBottomHeight?: number;
  shadowBorderColor?: string;
  shadowRingWidth?: number;
  showGradient?: boolean;
  isInsetShadowSidesFlattened?: boolean;
};

const progressRecede = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const StyledProgressOverlay = styled.span<{
  $borderRadius: number;
  $frameBoxShadow?: string;
}>(
  ({ $borderRadius, $frameBoxShadow }) => css`
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    border-radius: ${$borderRadius}px;

    ${$frameBoxShadow
      ? css`
          &::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            box-shadow: ${$frameBoxShadow};
          }
        `
      : null}
  `,
);

const StyledProgressFill = styled.span<{
  $duration: number;
  $restColor: string;
  $surfaceColor: string;
}>(
  ({ $duration, $restColor, $surfaceColor }) => css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background-color: ${$surfaceColor};
    background-image: linear-gradient(${$restColor}, ${$restColor});
    animation: ${progressRecede} ${$duration}ms linear forwards;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
      width: 0%;
    }
  `,
);

const ButtonProgressLoader = ({
  duration,
  restColor,
  surfaceColor,
  borderRadius,
  frameBoxShadow,
}: ButtonProgressLoaderProps): React.ReactElement => {
  return (
    <StyledProgressOverlay
      aria-hidden="true"
      $borderRadius={borderRadius}
      $frameBoxShadow={frameBoxShadow}
    >
      <StyledProgressFill
        $duration={duration}
        $restColor={restColor}
        $surfaceColor={surfaceColor}
      />
    </StyledProgressOverlay>
  );
};

export { ButtonProgressLoader };
export type { ButtonProgressLoaderProps };
