import { CSSObject, StyledProps } from 'styled-components';
import { StyledAccordionButtonProps } from './types';
import { Theme } from '../BladeProvider';
declare const getTransitionDuration: (theme: Theme) => import('../../utils/makeMotionTime/types').MakeMotionTime<80>;
declare const getTransitionEasing: (theme: Theme) => import('../../tokens/global/motion').EasingType<"cubic-bezier(0.3, 0, 0.2, 1)">;
declare const getBackgroundColor: ({ theme, isActive }: {
    theme: Theme;
    isActive: boolean;
}) => string;
declare const getCommonAccordionButtonStyles: (props: StyledProps<StyledAccordionButtonProps>) => CSSObject;
export { getTransitionDuration, getTransitionEasing, getBackgroundColor, getCommonAccordionButtonStyles, };
