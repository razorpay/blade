import React from 'react';
import { componentIds } from './componentIds';
import type { ActionListItemProps } from './ActionListItem';
import type { OptionsType } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';

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

const actionListAllowedChildren = [componentIds.ActionListItem, componentIds.ActionListSection];

export type SectionData = {
  title: string;
  hideDivider: boolean;
  data: ActionListItemProps[];
}[];

/**
 * Loops over action list items and returns different properties from children like option values, header and footer child, etc
 */
const getActionListProperties = (
  children: React.ReactNode,
): {
  sectionData: SectionData;
  childrenWithId?: React.ReactNode[] | null;
  actionListOptions: OptionsType;
} => {
  const sectionData: SectionData = [];
  let currentSection: string | null = null;
  const actionListOptions: OptionsType = [];

  const getActionListItemWithId = (
    child: React.ReactNode,
    hideDivider: boolean,
  ): React.ReactNode => {
    if (React.isValidElement(child) && !child.props.isDisabled) {
      actionListOptions.push({
        title: child.props.title,
        value: child.props.value,
        onClickTrigger: (value) => {
          const anchorLink = child.props.href;
          child.props.onClick?.({
            name: child.props.value,
            value: child.props.isSelected ?? value,
          });

          if (anchorLink && !isReactNative()) {
            const target = child.props.target ?? '_self';
            window.open(anchorLink, target);
            if (window.top) {
              window.top.open(anchorLink, target);
            }
          }
        },
      });
      const currentIndex = actionListOptions.length - 1;

      const foundSection = sectionData.find((v) => v.title === currentSection);
      // push the item in the appropriate bucket
      if (foundSection) {
        foundSection?.data.push({
          ...child.props,
          _index: currentIndex,
        });
      } else {
        // create a new bucket
        sectionData.push({
          title: currentSection!,
          hideDivider,
          data: [
            {
              ...child.props,
              _index: currentIndex,
            },
          ],
        });
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
      if (isValidAllowedChildren(child, componentIds.ActionListSection)) {
        const shouldHideDivider =
          index === lastActionListSectionIndex && !isActionListItemPresentAfterSection;
        const sectionChildValues: string[] = [];
        return React.cloneElement(child, {
          // @ts-expect-error: TS doesn't understand the child's props
          children: React.Children.map(child.props.children, (childInSection) => {
            currentSection = child.props.title;
            sectionChildValues.push(childInSection.props.value);
            if (isValidAllowedChildren(childInSection, componentIds.ActionListItem)) {
              return getActionListItemWithId(childInSection, shouldHideDivider);
            }

            return childInSection;
          }),
          // On web, we handle it with descendant styling in css so no need of JS there
          _hideDivider: isReactNative() ? shouldHideDivider : undefined,
          _sectionChildValues: sectionChildValues,
        });
      }

      if (isValidAllowedChildren(child, componentIds.ActionListItem)) {
        return getActionListItemWithId(child, true);
      }

      if (__DEV__) {
        throwBladeError({
          message: `Only ${actionListAllowedChildren.join(', ')} supported inside ActionList`,
          moduleName: 'ActionList',
        });
      }
    }
    return child;
  });

  return {
    sectionData,
    childrenWithId,
    actionListOptions,
  };
};

const validateActionListItemProps = ({
  leading,
  trailing,
  titleSuffix,
}: {
  leading: ActionListItemProps['leading'];
  trailing: ActionListItemProps['trailing'];
  titleSuffix: ActionListItemProps['titleSuffix'];
}): void => {
  if (__DEV__) {
    React.Children.map(trailing, (child) => {
      if (
        !isValidAllowedChildren(child, componentIds.ActionListItemIcon) &&
        !isValidAllowedChildren(child, componentIds.ActionListItemText)
      ) {
        throwBladeError({
          message: `Only ${componentIds.ActionListItemIcon} and ${componentIds.ActionListItemText} are allowed in trailing prop`,
          moduleName: 'ActionListItem',
        });
      }
    });

    React.Children.map(titleSuffix, (child) => {
      if (
        !isValidAllowedChildren(child, componentIds.ActionListItemBadge) &&
        !isValidAllowedChildren(child, componentIds.ActionListItemBadgeGroup)
      ) {
        throwBladeError({
          message: `Only ${componentIds.ActionListItemBadge} and ${componentIds.ActionListItemBadgeGroup} are allowed in titleSuffix prop`,
          moduleName: 'ActionListItem',
        });
      }
    });

    React.Children.map(leading, (child) => {
      if (
        !isValidAllowedChildren(child, componentIds.ActionListItemIcon) &&
        !isValidAllowedChildren(child, componentIds.ActionListItemText) &&
        !isValidAllowedChildren(child, componentIds.ActionListItemAsset) &&
        !isValidAllowedChildren(child, componentIds.ActionListItemAvatar)
      ) {
        throwBladeError({
          message: `Only ${componentIds.ActionListItemIcon}, ${componentIds.ActionListItemAvatar}, ${componentIds.ActionListItemAsset}, and ${componentIds.ActionListItemText} are allowed in leading prop`,
          moduleName: 'ActionListItem',
        });
      }
    });
  }
};

const getNormalTextColor = (
  isDisabled: boolean | undefined,
  { isMuted }: { isMuted?: boolean } = {},
): Extract<
  BaseTextProps['color'],
  'interactive.text.gray.disabled' | 'interactive.text.gray.muted' | 'interactive.text.gray.normal'
> => {
  if (isDisabled) {
    return 'interactive.text.gray.disabled';
  }

  if (isMuted) {
    return 'interactive.text.gray.muted';
  }

  return 'interactive.text.gray.normal';
};

export { getActionListProperties, validateActionListItemProps, getNormalTextColor };
