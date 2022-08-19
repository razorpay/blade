import type { MakeSize } from '~utils';
import { makeSize } from '~utils';
import type { DotNotationMotionStringToken } from '~src/_helpers/types';
import type { Motion } from '~tokens/global';

export type SpinnerMotion = {
  easing: `easing.${DotNotationMotionStringToken<Motion['easing']>}`;
  duration: `duration.${keyof Motion['duration']}`;
};

const motion: SpinnerMotion = {
  easing: 'easing.standard.attentive',
  duration: `duration.2xgentle`,
};

export type SpinnerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

type Sizes = 8 | 12 | 16 | 20 | 24 | 32;
export const getSpinnerSize = (size: SpinnerSize): MakeSize<Sizes> => {
  const sizeMap = {
    xsmall: 8,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    '2xlarge': 32,
  } as const;

  return makeSize(sizeMap[size]);
};

export { motion };
