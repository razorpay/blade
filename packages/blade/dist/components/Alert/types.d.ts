import { ReactNode } from 'react';
import { FeedbackColors, SubtleOrIntense } from '../../tokens/theme/theme';
import { StyledPropsBlade } from '../Box/styledProps';
export type StyledAlertProps = {
    children: ReactNode;
    emphasis: SubtleOrIntense;
    color: FeedbackColors;
    isFullWidth: boolean;
    isDesktop: boolean;
} & StyledPropsBlade;
