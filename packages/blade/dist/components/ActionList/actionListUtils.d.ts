import { default as React } from 'react';
import { ActionListItemProps } from './ActionListItem';
import { OptionsType } from '../Dropdown/useDropdown';
import { BaseTextProps } from '../Typography/BaseText/types';
export type SectionData = {
    title: string;
    hideDivider: boolean;
    data: ActionListItemProps[];
}[];
/**
 * Loops over action list items and returns different properties from children like option values, header and footer child, etc
 */
declare const getActionListProperties: (children: React.ReactNode) => {
    sectionData: SectionData;
    childrenWithId?: React.ReactNode[] | null | undefined;
    actionListOptions: OptionsType;
};
declare const validateActionListItemProps: ({ leading, trailing, titleSuffix, }: {
    leading: ActionListItemProps['leading'];
    trailing: ActionListItemProps['trailing'];
    titleSuffix: ActionListItemProps['titleSuffix'];
}) => void;
declare const getNormalTextColor: (isDisabled: boolean | undefined, { isMuted }?: {
    isMuted?: boolean | undefined;
}) => Extract<BaseTextProps['color'], 'interactive.text.gray.disabled' | 'interactive.text.gray.muted' | 'interactive.text.gray.normal'>;
export { getActionListProperties, validateActionListItemProps, getNormalTextColor };
