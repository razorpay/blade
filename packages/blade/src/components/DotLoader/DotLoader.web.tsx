import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  dotLoaderTokens,
  dotLoaderGeometry,
  DOT_INDEXES,
  REDUCED_MOTION_LIFTED_DOT_INDEX,
} from './dotLoaderTokens';
import type { DotLoaderProps, DotLoaderSize } from './types';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const peakTranslateY = (size: DotLoaderSize): string => makeSize(-dotLoaderGeometry[size].lift);

/**
 * Up only — the dot lifts off the rest line and settles back, never dipping below
 * it. Holding the rest pose through the tail of the loop lets the stagger read as
 * a travelling wave instead of three dots moving in near-unison.
 *
 * The travel distance is baked into the keyframes, so each size needs its own set.
 */
const makeDotPulse = (size: DotLoaderSize): ReturnType<typeof keyframes> => keyframes`
  0%, ${dotLoaderTokens.restProgress * 100}%, 100% {
    transform: translateY(0);
    opacity: ${dotLoaderTokens.restOpacity};
  }
  ${dotLoaderTokens.peakProgress * 100}% {
    transform: translateY(${peakTranslateY(size)});
    opacity: ${dotLoaderTokens.peakOpacity};
  }
`;

const dotPulseBySize: Record<DotLoaderSize, ReturnType<typeof keyframes>> = {
  medium: makeDotPulse('medium'),
  large: makeDotPulse('large'),
};

const DotLoaderBox = styled.span<{ size: DotLoaderSize }>(({ size }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: makeSize(dotLoaderGeometry[size].boxSize),
  height: makeSize(dotLoaderGeometry[size].boxSize),
  gap: makeSize(dotLoaderGeometry[size].gap),
}));

const Dot = styled.span<{ dotIndex: number; dotColor: string; size: DotLoaderSize }>(
  ({ dotIndex, dotColor, size }) => {
    const delay = dotIndex * dotLoaderTokens.staggerMs;

    return css`
      width: ${makeSize(dotLoaderGeometry[size].dotSize)};
      height: ${makeSize(dotLoaderGeometry[size].dotSize)};
      border-radius: 50%;
      background-color: ${dotColor};
      opacity: ${dotLoaderTokens.restOpacity};
      animation: ${dotPulseBySize[size]} ${dotLoaderTokens.durationMs}ms ease-in-out ${delay}ms
        infinite;

      /* Static Figma pose: outer dots at rest, middle dot held at its peak. */
      @media (prefers-reduced-motion: reduce) {
        animation: none;
        ${dotIndex === REDUCED_MOTION_LIFTED_DOT_INDEX &&
        css`
          transform: translateY(${peakTranslateY(size)});
          opacity: ${dotLoaderTokens.peakOpacity};
        `}
      }
    `;
  },
);

const DotLoader = ({
  color = 'interactive.icon.gray.muted',
  size = 'medium',
  accessibilityLabel,
  testID,
}: DotLoaderProps): React.ReactElement => {
  const { theme } = useTheme();
  const resolvedColor = getIn(theme.colors, color);

  return (
    <DotLoaderBox
      size={size}
      {...(accessibilityLabel
        ? makeAccessible({ role: 'status', label: accessibilityLabel })
        : makeAccessible({ hidden: true }))}
      {...metaAttribute({ name: MetaConstants.DotLoader, testID })}
    >
      {DOT_INDEXES.map((dotIndex) => (
        <Dot key={dotIndex} dotIndex={dotIndex} dotColor={resolvedColor} size={size} />
      ))}
    </DotLoaderBox>
  );
};

export { DotLoader };
