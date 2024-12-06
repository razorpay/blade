/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import usePresence from 'use-presence';
import type { SpotlightPopoverTourMaskRect } from './types';
import { useTheme } from '~components/BladeProvider';
import { useWindowSize } from '~utils/useWindowSize';
import { makeSpace } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';

const scaleIn = keyframes`
  from {
    fill-opacity: 0;
  }
  to {
    fill-opacity: 1;
  }
`;
const fadeOut = keyframes`
  from {
    fill-opacity: 1;
  }
  to {
    fill-opacity: 0;
  }
`;

const pulsingAnimation = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const AnimatedFade = styled.rect<{ animationType: FlattenSimpleInterpolation | null }>(
  ({ animationType }) =>
    animationType === null
      ? ''
      : css`
          ${animationType}
        `,
);

const StyledPlusing = styled.rect<{ animationType: FlattenSimpleInterpolation | null }>(
  ({ animationType }) => {
    return animationType === null
      ? ''
      : css`
          ${animationType}
        `;
  },
);

type FadeRectProps = React.ComponentProps<'rect'> & {
  show: boolean;
};
const FadeRect = React.memo(
  ({ show, children, ...rest }: FadeRectProps): React.ReactElement => {
    const { theme } = useTheme();

    const duration = theme.motion.duration.gentle;
    const enter = css`
      animation: ${scaleIn} ${makeMotionTime(duration)}
        ${(theme.motion.easing.entrance as unknown) as string};
      animation-fill-mode: forwards;
    `;

    const exit = css`
      animation: ${fadeOut} ${makeMotionTime(duration)}
        ${(theme.motion.easing.exit as unknown) as string};
      animation-fill-mode: forwards;
    `;

    const { isVisible } = usePresence(Boolean(show), {
      transitionDuration: duration,
      initialEnter: false,
    });

    return (
      // @ts-expect-error styled compoennt types are different from react types
      <AnimatedFade animationType={isVisible ? enter : exit} {...rest}>
        {children}
      </AnimatedFade>
    );
  },
);

const PulsingRect = React.memo(
  (props: React.ComponentProps<'rect'>): React.ReactElement => {
    const pulsing = css`
      animation: ${pulsingAnimation} 2s;
      animation-iteration-count: infinite;
      animation-direction: alternate;
    `;

    return (
      // @ts-expect-error styled compoennt types are different from react types
      <StyledPlusing animationType={pulsing} {...props} />
    );
  },
);

type SpotlightPopoverTourMaskProps = {
  padding: number;
  size: SpotlightPopoverTourMaskRect;
  isTransitioning: boolean;
};

const absoluteFill = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: componentZIndices.tourMask,
} as const;

const _SpotlightPopoverTourMask = ({
  padding,
  size,
  isTransitioning,
}: SpotlightPopoverTourMaskProps): React.ReactElement => {
  const { theme } = useTheme();
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const width = size.width + padding;
  const height = size.height + padding;
  const x = size.x - (width - size.width) / 2;
  const y = size.y - (height - size.height) / 2;

  const borderWidth = theme.spacing[1];
  const borderRadius = theme.spacing[2];

  const isSizeZero = size.width === 0 || size.height === 0;

  return (
    <svg
      style={absoluteFill}
      viewBox={`0 0 ${windowWidth} ${windowHeight}`}
      fill="none"
      stroke="none"
      {...metaAttribute({ name: MetaConstants.TourMask })}
    >
      <PulsingRect
        x={x + borderWidth / 2}
        y={y + borderWidth / 2}
        width={width - borderWidth}
        height={height - borderWidth}
        stroke={theme.colors.surface.background.primary.intense}
        strokeWidth={makeSpace(borderWidth)}
        rx={borderRadius - 1}
        ry={borderRadius - 1}
        fill="transparent"
        opacity={isSizeZero ? 0 : 1}
      />

      <mask id="tour-mask" x={0} y={0} height="100%" width="100%" stroke="none">
        <rect height="100%" width="100%" fill="#fff" />
        {!isSizeZero && (
          <FadeRect
            show={!isTransitioning}
            x={x}
            y={y}
            width={width}
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="#000"
          />
        )}
      </mask>
      <rect
        height="100%"
        width="100%"
        mask="url(#tour-mask)"
        fill={theme.colors.overlay.background.subtle}
      />
    </svg>
  );
};

const SpotlightPopoverTourMask = assignWithoutSideEffects(React.memo(_SpotlightPopoverTourMask), {
  displayName: 'TourMask',
});
export { SpotlightPopoverTourMask };
