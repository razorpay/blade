import type { ProgressBarProps } from './ProgressBar';
import type { DelayString, DurationString, EasingString } from '~tokens/global';

type ProgressBarFilledProps = {
  backgroundColor: string;
  progress: number;
  fillMotionDuration: DurationString;
  pulseMotionDuration: DurationString;
  indeterminateMotionDuration: DurationString;
  pulseMotionDelay: DelayString;
  motionEasing: EasingString;
  type: ProgressBarProps['type'];
  isIndeterminate: boolean;
};

type CircularProgressBarFilledProps = Pick<
  ProgressBarProps,
  'size' | 'label' | 'showPercentage' | 'type'
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
