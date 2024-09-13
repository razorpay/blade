import { AnimatePresence, motion } from 'framer-motion';
import BaseBox from '~components/Box/BaseBox';
import type { BaseMotionProps } from './types';

const MotionBox = motion(BaseBox);

export const BaseMotionBox = ({
  children,
  motionVariants,
  isVisible = true,
  variant,
}: BaseMotionProps) => {
  return (
    <AnimatePresence>
      {isVisible ? (
        <MotionBox
          // kinda hack to build it as enhancer component
          as={children.type}
          variants={motionVariants}
          initial={variant === 'in' || variant === 'inout' ? 'initial' : undefined}
          animate="animate"
          exit={variant === 'out' || variant === 'inout' ? 'exit' : undefined}
          // We pass the props of children and not pass the children itself since the `as` prop already renders the children and we don't want to re-render it inside
          {...children.props}
        />
      ) : null}
    </AnimatePresence>
  );
};
