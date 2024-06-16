import type { CircularProgressBarFilledProps } from './types';
import { size } from '~tokens/global';

const indeterminateAnimation = {
  scaleXInitial: 1,
  scaleXMid: 5,
  scaleXFinal: 1,
  leftInitial: '-8%',
  leftMid: '50%',
  leftFinal: '103%',
  fillWidth: '5%',
};

const pulseAnimation = {
  opacityInitial: 0,
  opacityMid: 0.25,
  opacityFinal: 0,
  backgroundColor: 'white',
};

const circularProgressSizeTokens = {
  small: {
    size: size[24],
    strokeWidth: size[3],
    percentTextSize: 'small',
  },
  medium: {
    size: size[48],
    strokeWidth: size[5],
    percentTextSize: 'small',
  },
  large: {
    size: size[72],
    strokeWidth: size[7],
    percentTextSize: 'medium',
  },
} as const;

const getCircularProgressSVGTokens = ({
  size,
  progressPercent,
}: {
  size: NonNullable<CircularProgressBarFilledProps['size']>;
  progressPercent: number;
}): {
  sqSize: number;
  strokeWidth: number;
  radius: number;
  viewBox: string;
  dashArray: number;
  dashOffset: number;
} => {
  // Size of the enclosing square
  const sqSize = circularProgressSizeTokens[size].size;
  const strokeWidth = circularProgressSizeTokens[size].strokeWidth;

  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2;
  // Enclose circle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * progressPercent) / 100;

  return {
    sqSize,
    strokeWidth,
    radius,
    viewBox,
    dashArray,
    dashOffset,
  };
};

export {
  indeterminateAnimation,
  pulseAnimation,
  circularProgressSizeTokens,
  getCircularProgressSVGTokens,
};
