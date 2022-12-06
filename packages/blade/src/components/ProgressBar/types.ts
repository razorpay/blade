import type { ProgressBarVariant } from './ProgressBar';
import type { DelayString, DurationString, EasingString } from '~tokens/global/motion';

type ProgressBarFilledProps = {
  backgroundColor: string;
  progress: number;
  fillMotionDuration: DurationString;
  pulseMotionDuration: DurationString;
  pulseMotionDelay: DelayString;
  motionEasing: EasingString;
  variant: ProgressBarVariant;
};

export { ProgressBarFilledProps };
