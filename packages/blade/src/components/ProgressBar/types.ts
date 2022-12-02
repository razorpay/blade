import type { DurationString, EasingString } from '~tokens/global/motion';

type ProgressBarFilledProps = {
  backgroundColor: string;
  progress: number;
  fillMotionDuration: DurationString;
  fillMotionEasing: EasingString;
};

export { ProgressBarFilledProps };
