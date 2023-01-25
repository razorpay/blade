import styled from 'styled-components';
import React from 'react';
import { Text } from '../Typography';
import type { IconComponent } from '../Icons';
import { useTheme } from '../BladeProvider';
import { useListContext } from './ListContext';
import { UnorderedItemIcon } from './ListItemIcons';
import { ListItemElement } from './ListItemElement';
import {
  listItemBulletPaddingRight,
  listItemBulletPaddingTop,
  listItemPaddingBottom,
  listItemPaddingLeft,
} from './listTokens';
import type { ListProps } from './List';
import { getOrderedListItemBullet } from './getOrderedListItemBullet';
import Box from '~components/Box';
import { getIn, isValidAllowedChildren } from '~utils';

type ListItemProps = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[]
    | React.ReactNode;
  icon?: IconComponent;
  _itemNumber?: number;
};

const StyledListItem = styled(ListItemElement)<{
  level?: number;
  variant: NonNullable<ListProps['variant']>;
}>(({ level, theme, variant }) => ({
  paddingLeft: level ? getIn(theme, listItemPaddingLeft[variant][level]) : 0,
}));

const ListItem = ({ children, icon: Icon, _itemNumber }: ListItemProps): React.ReactElement => {
  const { level, size, icon: ListContextIcon, variant } = useListContext();
  const { platform } = useTheme();
  const ItemIcon = Icon ?? ListContextIcon;

  const childrenArray = React.Children.toArray(children);

  const childItem = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'List') ? null : child,
  );
  const childList = childrenArray.filter((child) =>
    isValidAllowedChildren(child, 'List') ? child : null,
  );

  return (
    <StyledListItem level={level} variant={variant}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        paddingBottom={listItemPaddingBottom}
      >
        {variant === 'unordered' ? (
          <Box
            paddingRight={listItemBulletPaddingRight[variant]}
            display="flex"
            alignSelf="flex-start"
            //@ts-expect-error needs hard-coded spacing thats not part of our tokens
            paddingTop={
              listItemBulletPaddingTop[`${variant}${ItemIcon ? 'WithIcon' : 'WithoutIcon'}`][
                platform
              ][size]
            }
          >
            {ItemIcon ? (
              <ItemIcon size={size} color="surface.text.subdued.lowContrast" />
            ) : (
              <UnorderedItemIcon level={level} />
            )}
          </Box>
        ) : (
          <Box paddingRight={listItemBulletPaddingRight[variant]} display="flex">
            <Text variant="body" type="subtle" size={size}>
              {`${getOrderedListItemBullet({
                itemNumber: _itemNumber ?? 1,
                level: level ?? 1,
              })}`}
            </Text>
          </Box>
        )}
        <Text variant="body" size={size}>
          {childItem}
        </Text>
      </Box>
      {childList}
    </StyledListItem>
  );
};

ListItem.componentId = 'ListItem';

export { ListItem };
export type { ListItemProps };
