import { default as React } from 'react';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
type ActionListProps = {
    children: React.ReactNode[];
    isVirtualized?: boolean;
} & TestID & DataAnalyticsAttribute;
/**
 * ### ActionList
 *
 * List of multiple actionable items. Can be used as menu items inside `Dropdown`,
 * `BottomSheet` and as selectable items when combined with `SelectInput`
 *
 * #### Usage
 *
 * ```jsx
 * <Dropdown>
 *  <SelectInput label="Select Action" />
 *  <DropdownOverlay>
 *    <DropdownHeader title="Header Title" />
 *    <ActionList>
 *      <ActionListItem
 *        title="Home"
 *        value="home"
 *        leading={<ActionListItemIcon icon={HomeIcon} />}
 *      />
 *      <ActionListItem
 *        title="Pricing"
 *        value="pricing"
 *        leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="India Flag" />}
 *      />
 *    </ActionList>
 *    <DropdownFooter><Button>Apply</Button></DropdownFooter>
 *  </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 */
declare const ActionList: React.MemoExoticComponent<({ children, testID, isVirtualized, ...rest }: ActionListProps) => React.ReactElement>;
export type { ActionListProps };
export { ActionList };
