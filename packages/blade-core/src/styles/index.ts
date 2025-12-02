export { baseTextStyles } from './BaseText';
export type { BaseTextVariants } from './BaseText';
export { utilityClasses, getUtilityClass } from './utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
export { default as utilities } from './utilities.module.css';
