import type { Motion } from '../../../tokens';
import globalMotion from '../../../tokens/global/motion';

// TODO: use ValueOf<>
export type SpinnerMotion = {
  easing: Motion['easing']['standard'][keyof Motion['easing']['standard']];
  duration: Motion['duration'][keyof Motion['duration']];
};

const motion: SpinnerMotion = {
  easing: globalMotion.easing.standard.attentive,
  duration: globalMotion.duration['2xgentle'],
};

const sizes = {
  xxsmall: 'xxsmall',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'medium',
  xlarge: 'xlarge',
} as const;

export type SpinnerSizes = typeof sizes;

type Sizes = '10px' | '12px' | '16px' | '20px' | '24px' | '32px';
export const getSpinnerSize = (size: keyof SpinnerSizes): Sizes => {
  const sizeMap = {
    xlarge: '32px',
    large: '24px',
    medium: '20px',
    small: '16px',
    xsmall: '12px',
    xxsmall: '10px',
  } as const;

  return sizeMap[size];
};

export { motion, sizes };
