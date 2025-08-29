import { default as React } from 'react';
import { DataAnalyticsAttribute, TestID } from '../../../utils/types';
import { AriaRoles } from '../../../utils/makeAccessible';
type SelectorGroupFieldProps = {
    children: React.ReactNode;
    labelledBy: string;
    position?: 'top' | 'left';
    accessibilityRole?: AriaRoles;
    componentName: 'checkbox-group' | 'radio-group' | 'chip-group';
} & TestID & DataAnalyticsAttribute;
declare const SelectorGroupField: ({ children, labelledBy, position, accessibilityRole, componentName, testID, ...props }: SelectorGroupFieldProps) => React.ReactElement;
export { SelectorGroupField };
