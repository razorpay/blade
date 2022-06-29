import type { Motion } from '../../../tokens';
import globalMotion from '../../../tokens/global/motion';
import type { MakeSize } from '../../../utils/makeSize';
import makeSize from '../../../utils/makeSize';

// TODO: use ValueOf<>
export type SpinnerMotion = {
  easing: Motion['easing']['standard'][keyof Motion['easing']['standard']];
  duration: Motion['duration'][keyof Motion['duration']];
};

const motion: SpinnerMotion = {
  easing: globalMotion.easing.standard.attentive,
  duration: globalMotion.duration['2xgentle'],
};

export type SpinnerSize = 'large' | 'xsmall' | 'xsmall' | 'small' | 'medium';

type Sizes = 10 | 12 | 16 | 20 | 24 | 32;
export const getSpinnerSize = (size: SpinnerSize): MakeSize<Sizes> => {
  const sizeMap = {
    large: 24,
    medium: 20,
    small: 16,
    xsmall: 12,
    xxsmall: 10,
  } as const;

  return makeSize(sizeMap[size]);
};

export { motion };
