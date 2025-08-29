import { default as React } from 'react';
import { BladeElementRef } from '../../utils/types';
declare const BaseFilterChip: React.ForwardRefExoticComponent<{
    value?: string | string[] | undefined;
    onClearButtonClick?: (({ value }: {
        value: string | string[];
    }) => void) | undefined;
    label: string;
    isDisabled?: boolean | undefined;
    selectionType?: "multiple" | "single" | undefined;
    id?: string | undefined;
    onKeyDown?: ((e: React.KeyboardEvent<Element>) => void) | undefined;
    onClick?: ((e: React.MouseEventHandler<Element>) => void) | undefined;
    onBlur?: ((e: React.FocusEventHandler<Element>) => void) | undefined;
    accessibilityProps?: Partial<import('../../utils/makeAccessible').AriaAttributes> | undefined;
} & import('../../utils/types').TestID & import('../../utils/types').DataAnalyticsAttribute & React.RefAttributes<BladeElementRef>>;
export { BaseFilterChip };
