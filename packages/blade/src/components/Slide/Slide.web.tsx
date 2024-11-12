import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';

export type SlideProps = BaseMotionEntryExitProps;

export const Slide = ({ children, variant = 'inout', isVisible, motionTriggers }: SlideProps) => {
  const moveVariants: MotionVariantsType = {
    initial: {
      transform: 'translateY(100%)',
    },
    animate: {
      transform: 'translateY(0%)',
    },
    exit: {
      transform: 'translateY(100%)',
    },
  };

  return (
    <BaseMotionEntryExit
      motionVariants={moveVariants}
      children={children}
      variant={variant}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
    />
  );
};
