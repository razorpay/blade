import { size } from '~tokens/global';

const sliderTokens = {
  size: {
    small: {
      thumb: size[12],
      pressedThumb: size[16],
      track: size[2],
      label: 'small',
    },
    medium: {
      thumb: size[16],
      pressedThumb: size[20],
      track: size[4],
      label: 'medium',
    },
    large: {
      thumb: size[20],
      pressedThumb: size[24],
      track: size[4],
      label: 'large',
    },
  },
  interactionTarget: size[44],
  maxGeneratedMarks: 20,
} as const;

export { sliderTokens };
