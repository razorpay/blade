import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { BaseMotionEntryExitProps, MotionVariantsType } from '~components/BaseMotion';

export type MoveProps = BaseMotionEntryExitProps;

export const Move = ({ children, variant = 'inout', isVisible, motionTriggers }: MoveProps) => {
  const moveVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    animate: {
      opacity: 1,
      transform: 'translateY(0px)',
    },
    exit: {
      opacity: 0,
      transform: 'translateY(20px)',
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
