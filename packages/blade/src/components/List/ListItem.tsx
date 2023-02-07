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
  listItemBulletMarginTop,
  listItemOrderedBulletBoxSize,
  listItemPaddingBottom,
  listItemPaddingLeft,
} from './listTokens';
import type { ListProps } from './List';
import { getOrderedListItemBullet } from './getOrderedListItemBullet';
import Box from '~components/Box';
import { getComponentId, getIn, metaAttribute, MetaConstants } from '~utils';

type ListItemProps = {
  /**
   * Children to be rendered for ListItem. This can be a text, ListItemLink or another List.
   *
   */
  children: React.ReactNode;
  /**
   * Icon to be rendered for a ListItem's bullet.
   *
   */
  icon?: IconComponent;
  /**
   * This is a private prop to be used only for internal logic purposes.
   *
   */
  _itemNumber?: undefined;
};

const StyledListItem = styled(ListItemElement)<{
  level?: number;
  variant: NonNullable<ListProps['variant']>;
  hasIcon: boolean;
}>(({ level, theme, variant, hasIcon }) => ({
  paddingLeft: level
    ? getIn(
        theme,
        listItemPaddingLeft[
          `${variant}${variant === 'unordered' && hasIcon ? 'WithIcon' : ''}` as NonNullable<
            ListProps['variant'] | 'unorderedWithIcon'
          >
        ][level],
      )
    : 0,
}));

const ListItem = ({ children, icon: Icon, _itemNumber }: ListItemProps): React.ReactElement => {
  const { level, size, icon: ListContextIcon, variant } = useListContext();
  const { theme, platform } = useTheme();
  const ItemIcon = Icon ?? ListContextIcon;

  if (level && level > 3) {
    throw new Error('[Blade List]: List Nesting is allowed only upto 3 levels.');
  }

  const childrenArray = React.Children.toArray(children);

  // Get children that are not a List component
  const childItem = childrenArray.filter((child) =>
    getComponentId(child) !== 'List' ? child : null,
  );
  // Get child that is a List component
  const childList = childrenArray.filter((child) =>
    getComponentId(child) === 'List' ? child : null,
  );
  const hasIcon = Boolean(ItemIcon);

  return (
    <StyledListItem
      level={level}
      variant={variant}
      hasIcon={hasIcon}
      {...metaAttribute(MetaConstants.Component, MetaConstants.ListItem)}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={listItemPaddingBottom}
      >
        {variant === 'unordered' ? (
          <Box
            paddingRight={listItemBulletPaddingRight[variant]}
            marginTop={
              listItemBulletMarginTop[`${variant}${hasIcon ? 'WithIcon' : ''}`][platform][size]
            }
            display="flex"
            alignSelf="flex-start"
          >
            {ItemIcon ? (
              <ItemIcon size={size} color="surface.text.subdued.lowContrast" />
            ) : (
              <UnorderedItemIcon level={level} />
            )}
          </Box>
        ) : (
          <Box
            width={listItemOrderedBulletBoxSize[variant][platform][size]}
            height={listItemOrderedBulletBoxSize[variant][platform][size]}
            marginRight={listItemBulletPaddingRight[variant]}
            marginTop={listItemBulletMarginTop[variant][platform][size]}
            display="flex"
            flexShrink={0}
            justifyContent="center"
            alignSelf="flex-start"
            alignItems="center"
            borderRadius={variant === 'ordered-filled' ? 'max' : undefined}
            backgroundColor={
              variant === 'ordered-filled'
                ? getIn(theme, 'colors.brand.gray.a100.lowContrast')
                : undefined
            }
          >
            <Text variant="body" type="subtle" size={variant === 'ordered' ? size : 'xsmall'}>
              {`${getOrderedListItemBullet({
                itemNumber: _itemNumber ?? 1,
                level: level ?? 1,
              })}${variant === 'ordered' ? '.' : ''}`}
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
