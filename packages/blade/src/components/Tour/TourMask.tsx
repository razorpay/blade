/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import usePresence from 'use-presence';
import type { TourMaskRect } from './types';
import { useWindowSize } from '~utils/useWindowSize';
import { makeSpace, useTheme } from '~utils';
import { makeMotionTime } from '~utils/makeMotionTime';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

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

const AnimatedFade = styled.rect<{ animationType: FlattenSimpleInterpolation | null }>(
  ({ animationType }) =>
    animationType === null
      ? ''
      : css`
          ${animationType}
        `,
);

type FadeRectProps = React.ComponentProps<'rect'> & {
  show: boolean;
};
const FadeRect = ({ show, children, ...rest }: FadeRectProps): React.ReactElement => {
  const { theme } = useTheme();

  const duration = theme.motion.duration.gentle;
  const enter = css`
    animation: ${scaleIn} ${makeMotionTime(duration)}
      ${theme.motion.easing.entrance.effective as string};
  `;

  const exit = css`
    animation: ${fadeOut} ${makeMotionTime(duration)}
      ${theme.motion.easing.exit.effective as string};
  `;

  const { isMounted, isVisible } = usePresence(Boolean(show), {
    transitionDuration: duration,
    initialEnter: false,
  });

  return (
    <>
      {isMounted && (
        // @ts-expect-error
        <AnimatedFade animationType={isVisible ? enter : exit} {...rest}>
          {children}
        </AnimatedFade>
      )}
    </>
  );
};

type TourMaskProps = {
  padding: number;
  size: TourMaskRect;
  isTransitioning: boolean;
};

const absoluteFill = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  // TODO: tokenize z-index values
  zIndex: 100,
} as const;

const TourMask = ({ padding, size, isTransitioning }: TourMaskProps): React.ReactElement => {
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
      <rect
        x={x + borderWidth / 2}
        y={y + borderWidth / 2}
        width={width - borderWidth}
        height={height - borderWidth}
        stroke={theme.colors.brand.primary[500]}
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
        fill={theme.colors.surface.overlay.background[800]}
      />
    </svg>
  );
};

export { TourMask };
export type { TourMaskRect as Rect };
