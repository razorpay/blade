/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import { getActionListProperties } from './actionListUtils';
import { ActionListBox } from './ActionListBox';
import { componentIds } from './componentIds';
import { ActionListNoResults } from './ActionListNoResults';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { TestID } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';

type ActionListProps = {
  children: React.ReactNode[];
} & TestID;

const _ActionList = ({ children, testID }: ActionListProps): React.ReactElement => {
  const {
    setOptions,
    actionListItemRef,
    selectionType,
    dropdownBaseId,
    dropdownTriggerer,
    hasFooterAction,
    filteredValues,
  } = useDropdown();

  const { isInBottomSheet } = useBottomSheetContext();

  const { sectionData, childrenWithId, actionListOptions } = React.useMemo(
    () => getActionListProperties(children),
    [children],
  );

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionListOptions]);

  if (
    filteredValues.length <= 0 &&
    dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete
  ) {
    return <ActionListNoResults />;
  }

  const actionListContainerRole = getActionListContainerRole(hasFooterAction, dropdownTriggerer);
  const actionListItemWrapperRole = getActionListItemWrapperRole(
    hasFooterAction,
    dropdownTriggerer,
  );
  const isMultiSelectable = selectionType === 'multiple';

  // If we are inside BottomSheet, we don't render The StyledActionList wrapper
  // This is to ensure:
  // 1. We don't render the box wrapper styles which includes shadows, padding, border etc
  // 2. to ensure GorhomBottomSheetSectionList works as expected, if we add extra wrappers GorhomBottomSheet won't render the content inside
  // NOTE: That this also means inside BottomSheet, ActionList won't render any ActionListHeader or Footer.
  return isInBottomSheet ? (
    <ActionListBox
      isInBottomSheet={isInBottomSheet}
      actionListItemWrapperRole={actionListItemWrapperRole}
      childrenWithId={childrenWithId}
      sectionData={sectionData}
      isMultiSelectable={isMultiSelectable}
      ref={actionListItemRef as any}
    />
  ) : (
    <BaseBox
      id={`${dropdownBaseId}-actionlist`}
      {...makeAccessible({
        role: actionListContainerRole,
        multiSelectable: actionListContainerRole === 'listbox' ? isMultiSelectable : undefined,
        labelledBy: `${dropdownBaseId}-label`,
      })}
      {...metaAttribute({ name: MetaConstants.ActionList, testID })}
    >
      <ActionListBox
        isInBottomSheet={isInBottomSheet}
        actionListItemWrapperRole={actionListItemWrapperRole}
        childrenWithId={childrenWithId}
        sectionData={sectionData}
        isMultiSelectable={isMultiSelectable}
        ref={actionListItemRef as any}
      />
    </BaseBox>
  );
};

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
const ActionList = assignWithoutSideEffects(React.memo(_ActionList), {
  displayName: componentIds.ActionList,
  componentId: componentIds.ActionList,
});

export type { ActionListProps };
export { ActionList };
