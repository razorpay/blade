import React from 'react';
import type { IconComponent } from '..';
import { ListProvider, useListContext } from './ListContext';
import { UnorderedList } from './UnorderedList';
import { OrderedList } from './OrderedList';
import { ComponentIds } from './listTokens';
import type { ListItemProps } from './ListItem';
import { isValidAllowedChildren, metaAttribute, MetaConstants } from '~utils';

type ListProps = {
  children: React.ReactElement<ListItemProps> | React.ReactElement<ListItemProps>[];
  variant?: 'unordered' | 'ordered' | 'ordered-filled';
  size?: 'small' | 'medium';
  icon?: IconComponent;
};

const List = ({ variant = 'unordered', size, children, icon }: ListProps): React.ReactElement => {
  const ListElement = variant === 'unordered' ? UnorderedList : OrderedList;
  const { level, size: listContextSize } = useListContext();
  const childrenArray = React.Children.toArray(children);

  const childListItems = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'ListItem') ? child : null,
  );

  return (
    <ListProvider
      value={{
        level: level ? level + 1 : 1,
        size: size ?? listContextSize,
        icon,
        variant,
      }}
    >
      <ListElement {...metaAttribute(MetaConstants.Component, MetaConstants.List)}>
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
