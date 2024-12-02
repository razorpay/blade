import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

export type FadeProps = Pick<
  BaseMotionEntryExitProps,
  'children' | 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
>;
