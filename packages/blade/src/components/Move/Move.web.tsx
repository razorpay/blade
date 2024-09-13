import { BaseMotionBox } from '~components/BaseMotion';
import type { BaseEntryExitMotionProps, BaseMotionBoxVariants } from '~components/BaseMotion';

export type MoveProps = BaseEntryExitMotionProps;

export const Move = ({ children }: MoveProps) => {
  const moveVariants: BaseMotionBoxVariants = {
    initial: {
      opacity: 0,
      y: '-10px',
    },
    animate: {
      opacity: 1,
      y: '0px',
    },
    exit: {
      opacity: 0,
      y: '-10px',
    },
  };

  return <BaseMotionBox motionVariants={moveVariants} children={children} />;
};
