/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import { getActionListProperties } from './actionListUtils';
import { StyledActionList } from './styles/StyledActionList';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import { ActionListItem, ActionListSection, ActionListSectionDivider } from './ActionListItem';
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
    sectionData,
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

  const renderActionListItem = React.useCallback(({ item }) => {
    return <ActionListItem {...item} />;
  }, []);

  const renderActionListSectionHeader = React.useCallback(({ section: { title } }) => {
    if (!title) return null;
    return <ActionListSection title={title} _hideDivider={true} children={undefined} />;
  }, []);

  const renderActionListSectionDivider = React.useCallback(
    ({ section: { title, hideDivider } }) => {
      if (!title) return null;
      if (hideDivider) return null;
      return <ActionListSectionDivider />;
    },
    [],
  );

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
        sections={sectionData}
        windowSize={5}
        initialNumToRender={5}
        bouncesZoom={false}
        bounces={false}
        keyExtractor={(item: any) => {
          return item.value;
        }}
        renderSectionHeader={renderActionListSectionHeader}
        renderSectionFooter={renderActionListSectionDivider}
        renderItem={renderActionListItem}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={actionListItemRef as any}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      >
        {/* children with id is for rendering in web */}
        {childrenWithId}
      </StyledListBoxWrapper>
      {actionListFooterChild}
    </StyledActionList>
  );
};

const ActionList = React.memo(_ActionList);

export { ActionList, ActionListProps };
