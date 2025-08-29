import { SpotlightPopoverStepRenderProps } from './types';
import { ButtonProps } from '../Button';
type SpotlightPopoverFooterAction = {
    text?: string;
} & Pick<ButtonProps, 'variant' | 'icon' | 'iconPosition' | 'isDisabled' | 'isLoading' | 'onClick'>;
type SpotlightPopoverTourFooterProps = {
    actions: {
        primary?: SpotlightPopoverFooterAction;
        secondary?: SpotlightPopoverFooterAction;
    };
};
declare const SpotlightPopoverTourFooter: ({ activeStep, totalSteps, actions, }: SpotlightPopoverTourFooterProps & Pick<SpotlightPopoverStepRenderProps, 'activeStep' | 'totalSteps'>) => React.ReactElement;
export { SpotlightPopoverTourFooter };
