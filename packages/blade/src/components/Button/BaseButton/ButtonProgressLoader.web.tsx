import styled, { css, keyframes } from 'styled-components';

type ButtonProgressLoaderProps = {
  duration: number;
  restColor: string;
  borderRadius: number;
  frameBoxShadow?: string;
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
}>(
  ({ $duration, $restColor }) => css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
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
  borderRadius,
  frameBoxShadow,
}: ButtonProgressLoaderProps): React.ReactElement => {
  return (
    <StyledProgressOverlay
      aria-hidden="true"
      $borderRadius={borderRadius}
      $frameBoxShadow={frameBoxShadow}
    >
      <StyledProgressFill $duration={duration} $restColor={restColor} />
    </StyledProgressOverlay>
  );
};

export { ButtonProgressLoader };
export type { ButtonProgressLoaderProps };
