import React from 'react';
import type { BaseMotionBoxProps, MotionVariantsType } from '~components/BaseMotion';

type StaggerContextType = {
  isInsideStaggerContainer: boolean;
  staggerType: BaseMotionBoxProps['type'];
  /**
   * Native-only. Per-child stagger offset (in **seconds**) injected into the child's resolved
   * `transition.delay` at the `BaseMotionBox.native` choke point. Web relies on framer's
   * `staggerChildren` and never reads this field.
   */
  staggerDelay?: { enter: number; exit: number };
  /**
   * Native-only. The visibility target (`'animate' | 'exit'`) the parent `Stagger` drives every
   * child towards in lockstep (offset by `staggerDelay`). Web propagates visibility through
   * framer's variant cascade instead.
   */
  staggerVisibility?: keyof MotionVariantsType;
  /**
   * Native-only. Flags the child whose exit finishes last (largest total exit time). Its exit
   * completion drives the container's deferred unmount for `shouldUnmountWhenHidden`.
   */
  isLastStaggerChild?: boolean;
  /**
   * Native-only. Invoked by the last stagger child when its transition completes so the container
   * can unmount after the final exit animation. No-op on web.
   */
  onStaggerComplete?: (targetName: keyof MotionVariantsType) => void;
};

const StaggerContext = React.createContext<StaggerContextType>({
  isInsideStaggerContainer: false,
  staggerType: 'inout',
});

const useStagger = (): StaggerContextType => {
  const staggerContextValue = React.useContext(StaggerContext);
  return staggerContextValue;
};

export { useStagger, StaggerContext };
export type { StaggerContextType };
