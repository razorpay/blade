import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

type StaggerProps = Pick<
  BaseMotionEntryExitProps,
  'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
> & {
  children: React.ReactElement[] | React.ReactElement;
};

export type { StaggerProps };
