import { default as React } from 'react';
import { TouchableOpacity } from 'react-native';
import { IconComponent } from '../Icons';
import { FeedbackColors } from '../../tokens/theme/theme';
import { Platform } from '../../utils';
import { DataAnalyticsAttribute, StringChildrenType, TestID } from '../../utils/types';
import { BadgeProps } from '../Badge';
import { AvatarProps } from '../Avatar/types';
type ActionListItemProps = {
    title: string;
    description?: string;
    onClick?: (clickProps: {
        name: string;
        value?: boolean;
        event: Platform.Select<{
            web: React.MouseEvent;
            native: React.TouchEvent<TouchableOpacity>;
        }>;
    }) => void;
    /**
     * value that you get from `onChange` event on SelectInput or in form submissions.
     */
    value: string;
    /**
     * Link to open when item is clicked.
     */
    href?: string;
    /**
     * HTML target of the link
     */
    target?: string;
    /**
     * Item that goes on left-side of item.
     *
     * Valid elements - `<ActionListItemIcon />`, `<ActionListItemAsset />`
     *
     * Will be overriden in multiselect
     */
    leading?: React.ReactNode;
    /**
     * Item that goes on right-side of item.
     *
     * Valid elements - `<ActionListItemText />`, `<ActionListItemIcon />`
     */
    trailing?: React.ReactNode;
    /**
     * Item that goes immediately next to the title.
     *
     * Valid elements - `<ActionListItemBadge />`, `<ActionListItemBadgeGroup />`
     *
     */
    titleSuffix?: React.ReactElement;
    isDisabled?: boolean;
    intent?: Extract<FeedbackColors, 'negative'>;
    /**
     * Can be used in combination of `onClick` to highlight item as selected in Button Triggers.
     *
     * When trigger is SelectInput, Use `value` prop on SelectInput instead to make dropdown controlled.
     */
    isSelected?: boolean;
    /**
     * Internally passed from ActionList. No need to pass it explicitly
     *
     * @private
     */
    _index?: number;
    /**
     * Internally used to pass index for virtualized lists
     *
     * @private
     */
    _virtualizedIndex?: number;
    /**
     * Internally used to focus on virtualized list
     *
     * @private
     */
    _onVirtualizedFocus?: (_virtuazedIndex: number) => void;
} & TestID & DataAnalyticsAttribute;
type ActionListSectionProps = {
    title: string;
    children: React.ReactNode[] | React.ReactNode;
    /**
     * Internally used to hide the divider on final item in React Native
     *
     * Should not be used by consumers (also won't work on web)
     *
     * @private
     */
    _hideDivider?: boolean;
    /**
     * Internally used to hide / show section in AutoComplete
     *
     * @private
     */
    _sectionChildValues?: string[];
} & TestID & DataAnalyticsAttribute;
declare const ActionListSectionTitle: ({ title, isInsideVirtualizedList, }: {
    title: string;
    isInsideVirtualizedList?: boolean | undefined;
}) => React.ReactElement;
declare const ActionListSection: React.MemoExoticComponent<({ title, children, testID, _hideDivider, _sectionChildValues, ...rest }: ActionListSectionProps) => React.ReactElement>;
declare const ActionListItemIcon: ({ icon }: {
    icon: IconComponent;
}) => React.ReactElement;
declare const ActionListItemBadgeGroup: ({ children, }: {
    children: React.ReactElement[] | React.ReactElement;
}) => React.ReactElement;
declare const ActionListItemAvatar: (avatarProps: Omit<AvatarProps, 'size' | ''>) => React.ReactElement;
declare const ActionListItemBadge: (props: BadgeProps) => React.ReactElement;
declare const ActionListItemText: ({ children, }: {
    children: StringChildrenType;
}) => React.ReactElement;
declare const ActionListItem: React.MemoExoticComponent<(props: ActionListItemProps) => React.ReactElement>;
export type { ActionListItemProps, ActionListSectionProps };
export { ActionListItem, ActionListItemIcon, ActionListItemText, ActionListItemAvatar, ActionListItemBadge, ActionListItemBadgeGroup, ActionListSection, ActionListSectionTitle, };
