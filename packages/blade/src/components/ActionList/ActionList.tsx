import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import { getActionListContainerRole, getActionListItemWrapperRole } from './getA11yRoles';
import Box from '~components/Box';
import type { OptionsType } from '~components/Dropdown/useDropdown';
import { useDropdown } from '~components/Dropdown/useDropdown';
import {
  getComponentId,
  isReactNative,
  isValidAllowedChildren,
  makeAccessible,
  makeSize,
  isAndroid,
} from '~utils';
import { useTheme } from '~components/BladeProvider';

type ActionListProps = {
  children: React.ReactNode[];
  surfaceLevel?: 2 | 3;
};

const StyledActionList = styled(Box)<{
  surfaceLevel: ActionListProps['surfaceLevel'];
  elevation?: number;
}>(({ theme, surfaceLevel = 2 }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[2];
  const blur = theme.shadows.blurRadius.level[2];
  const shadowColor = theme.shadows.color.level[1];

  // @TODO: tokenize shadows and replace the logic here
  const elevation200 = `${makeSize(offsetX)} ${makeSize(offsetY)} ${makeSize(
    blur,
  )} 0px ${shadowColor}`;
  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    backgroundColor,
    borderWidth: theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderRadius: makeSize(theme.border.radius.medium),
    padding: makeSize(theme.spacing[3]),
    boxShadow: isReactNative() ? undefined : elevation200,

    // For react native. Ignored in web
    shadowOpacity: '1',
    shadowRadius: blur,
    shadowColor: isAndroid() ? undefined : shadowColor,
    shadowOffset: `${makeSize(offsetX)} ${makeSize(offsetY)}`,
  };
});

const ActionList = ({ children, surfaceLevel = 2 }: ActionListProps): JSX.Element => {
  const {
    setOptions,
    actionListRef,
    selectionType,
    dropdownBaseId,
    setSelectedIndices,
    optionsRecalculateToggle,
    dropdownTriggerer,
    hasFooterAction,
  } = useDropdown();

  const actionListOptions: OptionsType = [];

  const { theme } = useTheme();

  const defaultSelectedIndices: number[] = [];

  const getActionListItemWithId = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child)) {
      actionListOptions.push({
        title: child.props.title,
        value: child.props.value,
        href: child.props.href,
      });
      const currentIndex = actionListOptions.length - 1;

      if (child.props.isDefaultSelected) {
        defaultSelectedIndices.push(currentIndex);
      }

      const clonedChild = React.cloneElement(child, {
        // @ts-expect-error: TS doesn't understand the child's props
        _index: currentIndex,
      });
      return clonedChild;
    }

    return child;
  };

  const childCompIdArray = React.Children.toArray(children).map((child) => getComponentId(child));
  const lastActionListSectionIndex = childCompIdArray.lastIndexOf(componentIds.ActionListSection);

  const isActionListItemPresentAfterSection = childCompIdArray
    .slice(lastActionListSectionIndex)
    .includes(componentIds.ActionListItem);

  let actionListHeaderChild: React.ReactElement | null = null;
  let actionListFooterChild: React.ReactElement | null = null;
  // Looping through ActionListItems to add index to them and get an options array for moving focus between items
  const childrenWithId = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      if (isValidAllowedChildren(child, componentIds.ActionListHeader)) {
        actionListHeaderChild = child;
        return null;
      }

      if (isValidAllowedChildren(child, componentIds.ActionListFooter)) {
        actionListFooterChild = child;
        return null;
      }

      if (isValidAllowedChildren(child, componentIds.ActionListSection)) {
        return React.cloneElement(child, {
          // @ts-expect-error: TS doesn't understand the child's props
          children: React.Children.map(child.props.children, (childInSection) => {
            if (isValidAllowedChildren(childInSection, componentIds.ActionListItem)) {
              return getActionListItemWithId(childInSection);
            }

            return childInSection;
          }),
          hideDivider: index === lastActionListSectionIndex && !isActionListItemPresentAfterSection,
        });
      }

      if (isValidAllowedChildren(child, componentIds.ActionListItem)) {
        return getActionListItemWithId(child);
      }
    }
    return child;
  });

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsRecalculateToggle]);

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

  return (
    <StyledActionList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      surfaceLevel={surfaceLevel}
      elevation={theme.shadows.androidElevation.level[2]}
      id={`${dropdownBaseId}-actionlist`}
      {...makeAccessible({
        role: actionListContainerRole,
        multiSelectable: actionListContainerRole === 'listbox' ? isMultiSelectable : undefined,
        labelledBy: `${dropdownBaseId}-label`,
      })}
    >
      {actionListHeaderChild}
      <Box
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      >
        {childrenWithId}
      </Box>
      {actionListFooterChild}
    </StyledActionList>
  );
};

export { ActionList };
