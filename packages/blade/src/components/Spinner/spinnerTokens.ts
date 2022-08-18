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

export type SpinnerSize = 'large' | 'xsmall' | 'xsmall' | 'small' | 'medium';

type Sizes = 10 | 12 | 16 | 20 | 24 | 32;
export const getSpinnerSize = (size: SpinnerSize): MakeSize<Sizes> => {
  const sizeMap = {
    xxsmall: 8,
    xsmall: 12,
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
  } as const;

  return makeSize(sizeMap[size]);
};

export { motion };
