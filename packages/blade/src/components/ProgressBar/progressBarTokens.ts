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
    size: 24,
    strokeWidth: 3,
    percentTextSize: 'small',
  },
  medium: {
    size: 48,
    strokeWidth: 5,
    percentTextSize: 'small',
  },
  large: {
    size: 72,
    strokeWidth: 7,
    percentTextSize: 'medium',
  },
} as const;

export { indeterminateAnimation, pulseAnimation, circularProgressSizeTokens };
