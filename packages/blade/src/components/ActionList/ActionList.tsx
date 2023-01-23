import React from 'react';
import styled from 'styled-components';
import { ActionListItem } from './ActionListItem';
import Box from '~components/Box';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { makeAccessible, makeSize } from '~utils';

/**
 *
 * ActionList
 *
 */

type ActionListProps = {
  children: React.ReactNode[];
  surfaceLevel?: 2 | 3;
};

const StyledActionList = styled(Box)<{ surfaceLevel: ActionListProps['surfaceLevel'] }>(
  ({ theme, surfaceLevel = 2 }) => {
    const offsetX = theme.shadows.offsetX.level[1];
    const offsetY = theme.shadows.offsetY.level[2];
    const blur = theme.shadows.blurRadius.level[2];
    const shadowColor = theme.shadows.color.level[1];

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
      boxShadow: elevation200,
    };
  },
);

const ActionList = ({ children, surfaceLevel = 2 }: ActionListProps): JSX.Element => {
  const {
    setOptions,
    actionListRef,
    selectionType,
    dropdownBaseId,
    setSelectedIndices,
    // selectedIndices,
  } = useDropdown();
  const actionListOptions: {
    title: string;
    value: string;
  }[] = [];

  const defaultSelectedIndices: number[] = [];

  // Looping through ActionListItems to add index to them and get an options array for moving focus between items
  const childrenWithId = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // @TODO: handle the scenario where ActionListItem is inside ActionListMenu
      if (child.type === ActionListItem) {
        actionListOptions.push({
          title: child.props.title,
          value: child.props.value,
        });
        const currentIndex = actionListOptions.length - 1;

        if (child.props.isDefaultSelected) {
          defaultSelectedIndices.push(currentIndex);
        }

        const clonedChild = React.cloneElement(child, {
          // @ts-expect-error: TS doesn't understand the child's props
          index: currentIndex,
        });
        return clonedChild;
      }
    }

    return child;
  });

  React.useEffect(() => {
    setOptions(actionListOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOptions, children]);

  React.useEffect(() => {
    setSelectedIndices(defaultSelectedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledActionList
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={actionListRef as any}
      {...makeAccessible({
        role: 'listbox',
        multiSelectable: selectionType === 'multiple',
        labelledBy: `${dropdownBaseId}-label`,
      })}
      id={`${dropdownBaseId}-listbox`}
      surfaceLevel={surfaceLevel}
    >
      {childrenWithId}
    </StyledActionList>
  );
};

export { ActionList, ActionListItem };
