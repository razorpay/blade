import type { SliderProps } from './types';

const sliderTrackHeight: Record<NonNullable<SliderProps['size']>, number> = {
  small: 2,
  medium: 4,
  large: 6,
};

const sliderThumbSize: Record<NonNullable<SliderProps['size']>, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

export { sliderTrackHeight, sliderThumbSize };
