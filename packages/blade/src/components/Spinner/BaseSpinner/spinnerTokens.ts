import type { Motion } from '../../../tokens';
import globalMotion from '../../../tokens/global/motion';

// TODO: use ValueOf<>
export type SpinnerMotion = {
  easing: Motion['easing']['standard'][keyof Motion['easing']['standard']];
  duration: Motion['duration'][keyof Motion['duration']];
};

const motion: SpinnerMotion = {
  easing: globalMotion.easing.standard.attentive,
  duration: globalMotion.duration['2xgentle'],
};

export { motion };
