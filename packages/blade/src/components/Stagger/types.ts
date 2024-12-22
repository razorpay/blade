import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import type { BoxProps } from '~components/Box';

type StaggerProps = Pick<
  BaseMotionEntryExitProps,
  'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
> & {
  children: React.ReactElement[] | React.ReactElement;
} & Omit<BoxProps, 'as'>;

export type { StaggerProps };
