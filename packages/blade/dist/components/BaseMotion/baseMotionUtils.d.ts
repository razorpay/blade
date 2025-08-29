import { BaseMotionBoxProps, MotionTriggersType, MotionVariantsType } from './types';
type AnimationType = 'animate' | 'whileHover' | 'whileInView' | 'whileTap' | 'whileFocus';
type AnimationVariablesType = Partial<Record<Exclude<AnimationType, 'animate'>, keyof MotionVariantsType>> & {
    animate?: BaseMotionBoxProps['animateVisibility'] | BaseMotionBoxProps['animate'];
};
declare const makeAnimationVariables: (motionTriggers: MotionTriggersType[], { animateVisibility }: {
    animateVisibility: BaseMotionBoxProps['animateVisibility'];
}) => AnimationVariablesType & {
    initial: string;
    exit: string;
};
declare const useMotionVariants: (motionVariants: BaseMotionBoxProps['motionVariants'], type: BaseMotionBoxProps['type']) => BaseMotionBoxProps['motionVariants'];
export { makeAnimationVariables, useMotionVariants };
