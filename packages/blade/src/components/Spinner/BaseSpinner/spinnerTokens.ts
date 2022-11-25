import type { DurationString, EasingString } from '~tokens/global/motion';

const dimensions = {
  medium: 16,
  large: 20,
  xlarge: 24,
} as const;

const motion: {
  duration: DurationString;
  easing: EasingString;
} = {
  duration: 'duration.2xgentle',
  easing: 'easing.standard.attentive',
};

export { dimensions, motion };
