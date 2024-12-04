import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

type MoveProps = Pick<
  BaseMotionEntryExitProps,
  'children' | 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
>;

export type { MoveProps };
