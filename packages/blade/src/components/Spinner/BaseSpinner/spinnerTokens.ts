import type { DurationString, EasingString } from '~tokens/global/motion';

const dimensions = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

const motion: {
  duration: DurationString;
  easing: EasingString;
} = {
  duration: 'duration.2xgentle',
  easing: 'easing.exit.attentive',
};

export { dimensions, motion };
