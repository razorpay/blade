import type { BaseMotionBoxProps } from '~components/BaseMotion';

export type AnimateInteractionsProps = {
  children: React.ReactElement;

  /**
   * AnimateInteractions is a component meant to give you triggers that animate children inside of it.
   *
   * So the motionTriggers you apply here will be applied on AnimateInteractions and children will animate based on that.
   *
   * E.g.
   *
   * ```jsx
   * <AnimateInteractions
   *    motionTriggers={['hover']}
   *  > // <-- When this is hovered
   *  <Box>
   *    <Move
   *      motionTriggers={['on-animate-interactions']}
   *    > // <-- this animates in
   *      <Box />
   *    </Move>
   *  </Box>
   * </AnimateInteractions>
   * ```
   */
  motionTriggers?: BaseMotionBoxProps['motionTriggers'];
};
