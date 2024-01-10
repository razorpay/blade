import type { ProgressBarVariant } from './ProgressBar';
import type { DelayString, DurationString, EasingString } from '~tokens/global';

type ProgressBarFilledProps = {
  backgroundColor: string;
  progress: number;
  fillMotionDuration: DurationString;
  pulseMotionDuration: DurationString;
  indeterminateMotionDuration: DurationString;
  pulseMotionDelay: DelayString;
  motionEasing: EasingString;
  variant: ProgressBarVariant;
  isIndeterminate: boolean;
};

export type { ProgressBarFilledProps };
