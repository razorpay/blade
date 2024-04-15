import type { ProgressBarVariant, ProgressBarProps } from './ProgressBar';
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

type CircularProgressBarFilledProps = Pick<
  ProgressBarProps,
  'size' | 'label' | 'showPercentage' | 'variant'
> & {
  isMeter: boolean;
  backgroundColor: string;
  fillColor: string;
  progressPercent: number;
  pulseMotionDuration: DurationString;
  fillMotionDuration: DurationString;
  pulseMotionDelay: DelayString;
  motionEasing: EasingString;
};

export type { ProgressBarFilledProps, CircularProgressBarFilledProps };
