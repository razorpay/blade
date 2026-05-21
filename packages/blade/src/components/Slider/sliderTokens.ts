import { size } from '~tokens/global';

const sliderTokens = {
  trackHeight: size[4],
  trackBorderRadius: size[4],
  thumbSize: size[16],
  thumbBorderRadius: size[16],
  thumbBorderWidth: size[2],
} as const;

export { sliderTokens };
