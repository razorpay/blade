import React, { useMemo } from 'react';
import styled from 'styled-components';
import type { IconComponent } from '../Icons';
import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { ComponentIds } from './listTokens';
import type { ListItemProps } from './ListItem';
import {
  getIn,
  isValidAllowedChildren,
  makeAccessible,
  makeSpace,
  metaAttribute,
  MetaConstants,
} from '~utils';
import type { DotNotationSpacingStringToken } from '~src/_helpers/types';

type ListProps = {
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
  variant?: 'unordered' | 'ordered' | 'ordered-filled';
  size?: 'small' | 'medium';
  icon?: IconComponent;
};

const StyledOrderedList = styled(OrderedList)<{ marginTop?: DotNotationSpacingStringToken }>(
  ({ marginTop, theme }) => ({
    marginTop: marginTop ? makeSpace(getIn(theme, marginTop)) : undefined,
  }),
);

const StyledUnorderedList = styled(UnorderedList)<{ marginTop?: DotNotationSpacingStringToken }>(
  ({ marginTop, theme }) => ({
    marginTop: marginTop ? makeSpace(getIn(theme, marginTop)) : undefined,
  }),
);

/**
 * List Component is used to display a set of related items that are composed of text/links. Each list item begins with a bullet or a number.
 *
 * ## Usage
 *
 * ```tsx
 *   <List
 *     variant='unordered'
 *     size='medium'
 *   >
 *    <ListItem>
 *      Item 1
 *      <List>
 *        <ListItem>Item 1.1</ListItem>
 *      </List>
 *    </ListItem>
 *    <ListItem>Item 2</ListItem>
 *  <List />
 * ```
 */
const List = ({ variant = 'unordered', size, children, icon }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? StyledUnorderedList : StyledOrderedList;
  const { level, size: listContextSize } = useListContext();
  const listContextValue = useMemo(
    () => ({
      level: level ? level + 1 : 1,
      size: size ?? listContextSize,
      icon,
      variant,
    }),
    [icon, level, listContextSize, size, variant],
  );

  const childrenArray = React.Children.toArray(children);
  const childListItems = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'ListItem') ? child : null,
  );

  return (
    <ListProvider value={listContextValue}>
      <ListElement
        marginTop={!level ? 'spacing.3' : undefined}
        {...metaAttribute(MetaConstants.Component, MetaConstants.List)}
        {...makeAccessible({ role: 'list' })} // Role needed for react-native
      >
        {variant === 'unordered'
          ? childListItems
          : childListItems.map((child, index) =>
              React.cloneElement(child as React.ReactElement, { _itemNumber: ++index }),
            )}
      </ListElement>
    </ListProvider>
  );
};

List.componentId = ComponentIds.List;

export { List };
export type { ListProps };
