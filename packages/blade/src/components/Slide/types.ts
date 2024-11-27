import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

type SlideDirections = 'top' | 'right' | 'bottom' | 'left';

export type SlideProps = BaseMotionEntryExitProps & {
  motionTriggers?: Omit<BaseMotionEntryExitProps['motionTriggers'], 'inView'>;
  direction?:
    | SlideDirections
    | {
        enter: SlideDirections;
        exit: SlideDirections;
      };
};
