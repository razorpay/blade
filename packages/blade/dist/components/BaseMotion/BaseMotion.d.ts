import { default as React } from 'react';
import { BaseMotionBoxProps, BaseMotionEntryExitProps } from './types';
import { BladeElementRef } from '../../utils/types';
declare const MotionDiv: React.ComponentType<{
    [x: string]: any;
    [x: number]: any;
    [x: symbol]: any;
} & import('framer-motion').MotionProps>;
/**
 * Base motion component that handles animation variables, reduced motion, type and motionTriggers prop, etc
 */
declare const BaseMotionBox: React.ForwardRefExoticComponent<BaseMotionBoxProps & React.RefAttributes<BladeElementRef>>;
/**
 * Used in AnimateInteraction, Scale, etc
 *
 * Enhances the child to add motion support
 */
declare const BaseMotionEnhancerBox: React.ForwardRefExoticComponent<BaseMotionBoxProps & React.RefAttributes<HTMLDivElement>>;
/**
 * Base component for entry / exit animations
 *
 * Handles states, entry exit controls, animation variables, mount / unmount, etc
 */
declare const BaseMotionEntryExit: ({ children, motionVariants, isVisible, type, motionTriggers, shouldUnmountWhenHidden, }: BaseMotionEntryExitProps) => React.ReactElement;
export { MotionDiv, BaseMotionBox, BaseMotionEnhancerBox, BaseMotionEntryExit };
