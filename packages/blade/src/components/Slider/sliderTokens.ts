import { size } from '~tokens/global';

const sliderSizes = {
  medium: {
    trackHeight: size[4],
    thumbSize: size[20],
    thumbBorderWidth: size[2],
  },
  large: {
    trackHeight: size[6],
    thumbSize: size[24],
    thumbBorderWidth: size[2],
  },
} as const;

export { sliderSizes };
