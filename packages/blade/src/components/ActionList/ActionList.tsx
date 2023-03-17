import React from 'react';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import { getActionListProperties } from './actionListUtils';
import { StyledActionList } from './styles/StyledActionList';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { makeAccessible, metaAttribute, MetaConstants } from '~utils';
import { useTheme } from '~components/BladeProvider';
import type { TestID } from '~src/_helpers/types';

type ActionListProps = {
  children: React.ReactNode[];
  /**
   * Decides the backgroundColor of ActionList
   */
  surfaceLevel?: 2 | 3;
} & TestID;

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
 *    <ActionList>
 *      <ActionListHeader
 *        title="Recent Searches"
 *        leading={<ActionListHeaderIcon icon={HistoryIcon} />}
 *      />
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
 *      <ActionListHeader
 *        title="Search Tips"
 *        leading={<ActionListFooterIcon icon={SearchIcon} />}
 *        trailing={
 *          <Button
 *            onClick={() => console.log('clicked')}
 *          >
 *            Apply
 *          </Button>
 *        }
 *      />
 *    </ActionList>
 *  </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 */
const _ActionList = ({ children, surfaceLevel = 2, testID }: ActionListProps): JSX.Element => {
  const {
    setOptions,
    actionListItemRef,
    selectionType,
    dropdownBaseId,
    setSelectedIndices,
    dropdownTriggerer,
    hasFooterAction,
  } = useDropdown();

  const { theme } = useTheme();

  const {
    childrenWithId,
    actionListOptions,
    defaultSelectedIndices,
    actionListHeaderChild,
    actionListFooterChild,
  } = React.useMemo(() => getActionListProperties(children), [children]);

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionListOptions]);

  React.useEffect(() => {
    setSelectedIndices(defaultSelectedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionListContainerRole = getActionListContainerRole(hasFooterAction, dropdownTriggerer);
  const actionListItemWrapperRole = getActionListItemWrapperRole(
    hasFooterAction,
    dropdownTriggerer,
  );
  const isMultiSelectable = selectionType === 'multiple';

  // React.useEffect(() => {
  //   console.log('children change, actionList', childrenWithId);
  // }, [childrenWithId]);

  // console.log('render actionList', {dropdownBaseId});
  return (
    <StyledActionList
      surfaceLevel={surfaceLevel}
      elevation={theme.shadows.androidElevation.level[2]}
      id={`${dropdownBaseId}-actionlist`}
      {...makeAccessible({
        role: actionListContainerRole,
        multiSelectable: actionListContainerRole === 'listbox' ? isMultiSelectable : undefined,
        labelledBy: `${dropdownBaseId}-label`,
      })}
      {...metaAttribute({ name: MetaConstants.ActionList, testID })}
    >
      {actionListHeaderChild}
      <StyledListBoxWrapper
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={actionListItemRef as any}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      >
        {childrenWithId}
      </StyledListBoxWrapper>
      {actionListFooterChild}
    </StyledActionList>
  );
};

const ActionList = React.memo(_ActionList);

export { ActionList, ActionListProps };
