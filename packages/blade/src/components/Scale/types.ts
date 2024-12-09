import type { BaseMotionBoxProps } from '~components/BaseMotion';

type ScaleProps = {
  isHighlighted?: boolean;
  variant?: 'scale-up' | 'scale-down';
  type?: BaseMotionBoxProps['type'];
  motionTriggers?: BaseMotionBoxProps['motionTriggers'];
  children: BaseMotionBoxProps['children'];
};

export type { ScaleProps };
