import { StepItemProps } from './types';
type StepLineProps = {
    stepType: 'single-item' | 'start' | 'middle' | 'end' | 'default';
    shouldShowStartBranch: boolean;
    shouldShowEndBranch: boolean;
} & Pick<StepItemProps, 'stepProgress' | 'marker'>;
declare const StepLine: ({ stepType, shouldShowStartBranch, shouldShowEndBranch, marker, stepProgress, }: StepLineProps) => React.ReactElement;
export type { StepLineProps };
export { StepLine };
