import { default as React } from 'react';
import { StepLine } from './StepLine';
import { StepItemProps } from './types';
/**
 * ## StepItem
 *
 * Component meant to be used inside the StepGroup parent component
 *
 * ### Usage
 *
 * ```jsx
 * <StepGroup orientation="vertical" size="medium">
 *   <StepItem
 *      title="Personal Details"
 *      timestamp="Thu 15th Oct'23 | 12:00pm"
 *      description="Fill your personal details here"
 *      marker={<StepItemIndicator color="negative" />}
 *    />
 * </StepGroup>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-stepgroup--docs StepGroup Documentation}
 */
declare const StepItem: ({ title, titleColor, timestamp, description, stepProgress, marker, trailing, isSelected, isDisabled, href, target, onClick, children, _index, _totalIndex, _nestingLevel, minWidth, ...rest }: StepItemProps) => React.ReactElement;
export { StepLine, StepItem };
