import styled from 'styled-components';
import React from 'react';
import { useListContext } from './ListContext';
import { UnorderedItemIcon } from './ListItemIcons';
import { ListItemElement } from './ListItemElement';
import {
  listItemBulletMarginRight,
  listItemBulletMarginTop,
  listItemOrderedBulletBoxSize,
  listItemMarginBottom,
  listItemMarginLeft,
} from './listTokens';
import type { ListProps } from './List';
import { getOrderedListItemBullet } from './getOrderedListItemBullet';
import getIn from '~utils/lodashButBetter/get';
import { Text } from '~components/Typography';
import type { IconComponent } from '~components/Icons';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { getPlatformType } from '~utils/getPlatformType';
import { throwBladeError } from '~utils/logger';

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
   * Icon color of the ListItem's bullet.
   *
   */
  iconColor?: ListProps['iconColor'];
  /**
   * This is a private prop to be used only for internal logic purposes.
   *
   */
  _itemNumber?: undefined;
} & TestID;

const StyledListItem = styled(ListItemElement)<{
  level?: number;
  variant: NonNullable<ListProps['variant']>;
  hasIcon: boolean;
}>(({ level, theme, variant, hasIcon }) => ({
  marginLeft: level
    ? getIn(
        theme,
        listItemMarginLeft[
          `${variant}${variant === 'unordered' && hasIcon ? 'WithIcon' : ''}` as NonNullable<
            ListProps['variant'] | 'unorderedWithIcon'
          >
        ][level],
      )
    : 0,
}));

const ListItemContentChildren = ({
  children,
  size,
}: {
  children: React.ReactNode[];
  size: NonNullable<ListProps['size']>;
}): React.ReactElement => {
  /* Having a <View><Text>...</Text><View/> inside <Text /> breaks vertical alignment. Issue: https://github.com/facebook/react-native/issues/31955
    As a workaround, we wrap individual strings in their own <Text /> and handle alignment with a parent <View> (BaseBox).
   */
  return getPlatformType() === 'react-native' ? (
    <BaseBox display="flex" flexDirection="row" flexWrap="wrap">
      {children.map((child, index) => {
        if (typeof child === 'string') {
          return (
            <Text key={index} variant="body" size={size}>
              {child}
            </Text>
          );
        }
        return child;
      })}
    </BaseBox>
  ) : (
    <Text variant="body" size={size}>
      {children}
    </Text>
  );
};

const _ListItem = ({
  children,
  icon: Icon,
  iconColor: listItemIconColor,
  _itemNumber,
  testID,
}: ListItemProps): React.ReactElement => {
  const { level, size, icon: ListContextIcon, variant, iconColor } = useListContext();
  const { theme, platform } = useTheme();
  const ItemIcon = Icon ?? ListContextIcon;
  const iconColorToken = listItemIconColor ?? iconColor ?? 'surface.icon.gray.muted';

  if (__DEV__) {
    if (level && level > 3) {
      throwBladeError({
        message: 'List Nesting is allowed only upto 3 levels.',
        moduleName: 'List',
      });
    }
  }

  const childrenArray = React.Children.toArray(children);

  // Get children that are not a List component and are valid allowed children
  const validChildItem = childrenArray.filter((child) => {
    if (getComponentId(child) === MetaConstants.List) return null;

    if (
      typeof child === 'string' ||
      isValidAllowedChildren(child, MetaConstants.ListItemLink) ||
      isValidAllowedChildren(child, MetaConstants.ListItemText) ||
      isValidAllowedChildren(child, MetaConstants.ListItemCode)
    ) {
      return child;
    } else if (__DEV__) {
      throwBladeError({
        message: `You can only pass a List, ListItemLink, ListItemCode, ListItemText or a string as a child to ListItem.`,
        moduleName: 'ListItem',
      });
    }
    return null;
  });
  // Get child that is a List component
  const childList = childrenArray.filter((child) =>
    getComponentId(child) === MetaConstants.List ? child : null,
  );
  const hasIcon = Boolean(ItemIcon);

  return (
    <StyledListItem
      level={level}
      variant={variant}
      hasIcon={hasIcon}
      {...metaAttribute({ name: MetaConstants.ListItem, testID })}
    >
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={listItemMarginBottom}
      >
        {variant === 'unordered' ? (
          <BaseBox
            marginRight={listItemBulletMarginRight[variant]}
            marginTop={
              listItemBulletMarginTop[`${variant}${hasIcon ? 'WithIcon' : ''}`][platform][size]
            }
            display="flex"
            alignSelf="flex-start"
          >
            {ItemIcon ? (
              <ItemIcon size={size} color={iconColorToken} />
            ) : (
              <UnorderedItemIcon level={level} />
            )}
          </BaseBox>
        ) : (
          <BaseBox
            width={listItemOrderedBulletBoxSize[variant][platform][size]}
            height={listItemOrderedBulletBoxSize[variant][platform][size]}
            marginRight={listItemBulletMarginRight[variant]}
            marginTop={listItemBulletMarginTop[variant][platform][size]}
            display="flex"
            flexShrink={0}
            justifyContent="center"
            alignSelf="flex-start"
            alignItems="center"
            borderRadius={variant === 'ordered-filled' ? 'max' : undefined}
            backgroundColor={
              variant === 'ordered-filled'
                ? getIn(theme.colors, 'feedback.background.neutral.subtle')
                : undefined
            }
          >
            <Text
              variant="body"
              color="surface.text.gray.muted"
              size={variant === 'ordered' ? size : 'xsmall'}
            >
              {`${getOrderedListItemBullet({
                itemNumber: _itemNumber ?? 1,
                level: level ?? 1,
              })}${variant === 'ordered' ? '.' : ''}`}
            </Text>
          </BaseBox>
        )}
        <ListItemContentChildren size={size}>{validChildItem}</ListItemContentChildren>
      </BaseBox>
      {childList}
    </StyledListItem>
  );
};

const ListItem = assignWithoutSideEffects(_ListItem, { componentId: MetaConstants.ListItem });

export { ListItem };
export type { ListItemProps };
