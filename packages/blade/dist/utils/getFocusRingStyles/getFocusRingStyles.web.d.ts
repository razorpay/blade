import { GetFocusRingArgs } from './types';
/**
 * @param props.theme Blade Theme Object
 * @param props.negativeOffset if set the outline offset will be set to -4px, this is useful
 * in table component where the outline will get cutoff by the table border
 */
declare function getFocusRingStyles({ theme, negativeOffset, isImportant, }: GetFocusRingArgs): {
    readonly outline: `4px solid ${string}${string}`;
    readonly outlineOffset: `-4px${string}` | `1px${string}`;
    readonly transitionProperty: "outline-width";
    readonly transitionDuration: import('../makeMotionTime/types').MakeMotionTime<80>;
    readonly transitionTimingFunction: import('../../tokens/global/motion').EasingType<"cubic-bezier(0.3, 0, 0.2, 1)">;
    readonly zIndex: 2;
};
export { getFocusRingStyles };
