import { ReactNode, default as React } from 'react';
import { ContainerElementType } from '../../../utils/types';
export declare const BaseInputWrapper: React.ForwardRefExoticComponent<Pick<import('./BaseInput').BaseInputProps, "isDisabled" | "validationState" | "maxTagRows" | "showAllTags" | "isDropdownTrigger"> & {
    isFocused?: boolean | undefined;
    isLabelLeftPositioned?: boolean | undefined;
    currentInteraction: import('../../../utils/useInteraction').ActionStates;
    isTextArea?: boolean | undefined;
    setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
    children: ReactNode;
    size: NonNullable<"medium" | "large" | undefined>;
    numberOfLines: 1 | 2 | 4 | 3 | 5 | undefined;
    isTableInputCell: NonNullable<boolean | undefined>;
    onClick?: ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void) | undefined;
} & {
    children: ReactNode;
} & React.RefAttributes<ContainerElementType>>;
