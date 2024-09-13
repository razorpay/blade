import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseEntryExitMotionProps, BaseMotionBoxVariants } from '~components/BaseMotion';

export type FadeProps = BaseEntryExitMotionProps;

export const Fade = ({ children, isVisible, variant = 'inout' }: FadeProps) => {
  const fadeVariants: BaseMotionBoxVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <BaseMotionBox
      motionVariants={fadeVariants}
      variant={variant}
      children={children}
      isVisible={isVisible}
    />
  );
};
