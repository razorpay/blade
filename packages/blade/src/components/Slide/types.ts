import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

export type SlideProps = BaseMotionEntryExitProps & {
  direction?: 'top' | 'right' | 'bottom' | 'left';
};
