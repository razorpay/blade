import styled from 'styled-components';
import React from 'react';
import { Text } from '../Typography';
import type { IconComponent } from '../Icons';
import { useListContext } from './ListContext';
import { UnorderedItemIcon } from './ListItemIcons';
import { ListItemElement } from './ListItemElement';
import { listItemPaddingBottom, listItemPaddingLeft } from './listTokens';
import Box from '~components/Box';
import { getIn, isValidAllowedChildren } from '~utils';

type ListItemProps = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[]
    | React.ReactNode;
  icon?: IconComponent;
};

const StyledListItem = styled(ListItemElement)<{ level?: number }>(({ level, theme }) => ({
  paddingLeft: level ? getIn(theme, listItemPaddingLeft[level]) : 0,
}));

const ListItem = ({ children, icon: Icon }: ListItemProps): React.ReactElement => {
  const { level, size, icon: ListContextIcon } = useListContext();
  const ItemIcon = Icon ?? ListContextIcon;

  const childrenArray = React.Children.toArray(children);

  const childItem = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'List') ? null : child,
  );
  const childList = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'List') ? child : null,
  );

  return (
    <StyledListItem level={level}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        paddingBottom={listItemPaddingBottom}
      >
        <Box paddingRight="spacing.3" display="flex">
          {ItemIcon ? (
            <ItemIcon size={size} color="surface.text.subdued.lowContrast" />
          ) : (
            <UnorderedItemIcon level={level} />
          )}
        </Box>
        <Text variant="body" size={size}>
          {childItem}
        </Text>
      </Box>
      {childList}
    </StyledListItem>
  );
};

export { ListItem };
export type { ListItemProps };
