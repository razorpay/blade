import type { SliderProps } from './types';
import { size } from '~tokens/global';

const sliderTrackHeight: Record<NonNullable<SliderProps['size']>, number> = {
  small: size[2],
  medium: size[3],
  large: size[4],
};

const sliderThumbSize: Record<NonNullable<SliderProps['size']>, number> = {
  small: size[12],
  medium: size[16],
  large: size[20],
};

export { sliderTrackHeight, sliderThumbSize };
