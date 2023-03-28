import React from 'react';
import { componentIds } from './componentIds';
import type { ActionListItemProps } from './ActionListItem';
import type { OptionsType } from '~components/Dropdown/useDropdown';
import { getComponentId, isReactNative, isValidAllowedChildren } from '~utils';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

/**
 * Returns if there is ActionListItem after ActionListSection
 * and an index of last ActionListSection
 *
 * It is used to decide if ActionListSection add divider at the end
 */
const getActionListSectionPosition = (
  children: React.ReactNode,
): {
  isActionListItemPresentAfterSection: boolean;
  lastActionListSectionIndex: number;
} => {
  // Creating an array of componentIds
  const childComponentIdArray = React.Children.toArray(children).map((child) =>
    getComponentId(child),
  );

  // Reading the last `ActionListSection` component's index
  const lastActionListSectionIndex = childComponentIdArray.lastIndexOf(
    componentIds.ActionListSection,
  );

  // Checking if there is any `ActionListItem` present after `ActionListSection`
  const isActionListItemPresentAfterSection = childComponentIdArray
    .slice(lastActionListSectionIndex)
    .includes(componentIds.ActionListItem);

  return {
    isActionListItemPresentAfterSection,
    lastActionListSectionIndex,
  };
};

const actionListAllowedChildren = [
  componentIds.ActionListFooter,
  componentIds.ActionListHeader,
  componentIds.ActionListItem,
  componentIds.ActionListSection,
];

/**
 * Loops over action list items and returns different properties from children like option values, header and footer child, etc
 */
const getActionListProperties = (
  children: React.ReactNode,
): {
  childrenData: OptionsType;
  childrenWithId?: React.ReactNode[] | null;
  actionListOptions: OptionsType;
  defaultSelectedIndices: number[];
  actionListHeaderChild: React.ReactElement | null;
  actionListFooterChild: React.ReactElement | null;
} => {
  const childrenData: ActionListItemProps[] = [];
  const actionListOptions: OptionsType = [];
  const defaultSelectedIndices: number[] = [];
  let actionListHeaderChild: React.ReactElement | null = null;
  let actionListFooterChild: React.ReactElement | null = null;

  const getActionListItemWithId = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child) && !child.props.isDisabled) {
      childrenData.push(child.props);
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

  let isActionListItemPresentAfterSection: boolean;
  // eslint-disable-next-line one-var
  let lastActionListSectionIndex: number;

  if (isReactNative()) {
    // We're reading this so that we can decide whether to show the divider or not.
    // If ActionListSection is final item and no ActionListItem is present after that, we hide the divider

    // On web, we do it using descendant styling
    ({
      isActionListItemPresentAfterSection,
      lastActionListSectionIndex,
    } = getActionListSectionPosition(children));
  }

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
        const shouldHideDivider =
          index === lastActionListSectionIndex && !isActionListItemPresentAfterSection;
        return React.cloneElement(child, {
          // @ts-expect-error: TS doesn't understand the child's props
          children: React.Children.map(child.props.children, (childInSection) => {
            if (isValidAllowedChildren(childInSection, componentIds.ActionListItem)) {
              return getActionListItemWithId(childInSection);
            }

            return childInSection;
          }),
          // On web, we handle it with descendant styling in css so no need of JS there
          _hideDivider: isReactNative() ? shouldHideDivider : undefined,
        });
      }

      if (isValidAllowedChildren(child, componentIds.ActionListItem)) {
        return getActionListItemWithId(child);
      }

      throw new Error(
        `[ActionList]: Only ${actionListAllowedChildren.join(', ')} supported inside ActionList`,
      );
    }
    return child;
  });

  return {
    childrenData,
    childrenWithId,
    actionListFooterChild,
    actionListHeaderChild,
    actionListOptions,
    defaultSelectedIndices,
  };
};

const validateActionListItemProps = ({
  leading,
  trailing,
}: {
  leading: ActionListItemProps['leading'];
  trailing: ActionListItemProps['trailing'];
}): void => {
  React.Children.map(trailing, (child) => {
    if (
      !isValidAllowedChildren(child, componentIds.ActionListItemIcon) &&
      !isValidAllowedChildren(child, componentIds.ActionListItemText)
    ) {
      throw new Error(
        `[ActionListItem]: Only ${componentIds.ActionListItemIcon} and ${componentIds.ActionListItemText} are allowed in trailing prop`,
      );
    }
  });

  React.Children.map(leading, (child) => {
    if (
      !isValidAllowedChildren(child, componentIds.ActionListItemIcon) &&
      !isValidAllowedChildren(child, componentIds.ActionListItemText) &&
      !isValidAllowedChildren(child, componentIds.ActionListItemAsset)
    ) {
      throw new Error(
        `[ActionListItem]: Only ${componentIds.ActionListItemIcon}, ${componentIds.ActionListItemAsset}, and ${componentIds.ActionListItemText} are allowed in leading prop`,
      );
    }
  });
};

const getNormalTextColor = (
  isDisabled: boolean | undefined,
  { isMuted }: { isMuted?: boolean } = {},
): Extract<
  BaseTextProps['color'],
  | 'surface.text.placeholder.lowContrast'
  | 'surface.text.muted.lowContrast'
  | 'surface.text.normal.lowContrast'
> => {
  if (isDisabled) {
    return 'surface.text.placeholder.lowContrast';
  }

  if (isMuted) {
    return 'surface.text.muted.lowContrast';
  }

  return 'surface.text.normal.lowContrast';
};

export { getActionListProperties, validateActionListItemProps, getNormalTextColor };
