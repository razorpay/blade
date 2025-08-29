import { BaseMotionEntryExitProps } from '../BaseMotion';
import { BoxProps } from '../Box';
type StaggerProps = Pick<BaseMotionEntryExitProps, 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'> & {
    children: React.ReactElement[] | React.ReactElement;
} & Omit<BoxProps, 'as'>;
export type { StaggerProps };
