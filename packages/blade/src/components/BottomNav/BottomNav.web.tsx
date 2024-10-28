import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { throwBladeError } from '~utils/logger';
import { makeAccessible } from '~utils/makeAccessible';
import type { BottomNavItemProps, BottomNavProps } from './types';

/**
 * ### BottomNav component
 *
 * Bottom navigation component is a persistent user interface element at the bottom of a mobile app screen, providing quick access to core functionalities through icons and labels.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
 * import { NavLink } from 'react-router-dom';
 *
 * <BottomNav>
 *   <BottomNavItem
 *     as={NavLink}
 *     isActive={true}
 *     title="Payments"
 *     icon={WalletIcon}
 *     href="/payments"
 *   />
 *   <BottomNavItem
 *     as={NavLink}
 *     title="Transactions"
 *     icon={TransactionsIcon}
 *     href="/transactions"
 *   />
 *   <BottomNavItem
 *     title="More"
 *     icon={MoreIcon}
 *     onClick={() => {
 *       // This can be used to open SideNav drawer
 *       setIsSideNavOpen(true)
 *     }}
 *   />
 * </BottomNav>
 * ```
 *
 * Checkout {@link https://blade.razorpay.com/??path=/docs/components-bottomnav--doc BottomNav Documentation}

 */
const BottomNav = ({ children, ...styledProps }: BottomNavProps) => {
  if (__DEV__) {
    const childrenCount = React.Children.count(children);
    if (childrenCount > 5 && childrenCount < 2) {
      throwBladeError({
        moduleName: 'BottomNav',
        message: 'children cannot be less than 2 and more than 5',
      });
    }
  }

  return (
    <BaseBox
      role="navigation"
      position="fixed"
      bottom="spacing.0"
      left="spacing.0"
      elevation="midRaised"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      paddingX="spacing.2"
      display="flex"
      flexDirection="row"
      {...getStyledProps(styledProps)}
    >
      {children}
    </BaseBox>
  );
};

const StyledBottomNavItem = styled(BaseBox)<{ to?: string }>((props) => {
  return {
    color: props.theme.colors.interactive.text.gray.subtle,
    '&[aria-current="page"]': {
      color: props.theme.colors.interactive.text.primary.subtle,
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme: props.theme }),
    },
  };
});

const BottomNavItem = ({ title, href, as, isActive, onClick, icon: Icon }: BottomNavItemProps) => {
  return (
    <StyledBottomNavItem
      as={as ?? href ? 'a' : 'button'}
      href={as ? undefined : href}
      to={href} // for react router
      paddingTop="spacing.5"
      paddingBottom="spacing.4"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flex="1"
      cursor="pointer"
      {...makeAccessible({
        current: isActive ? 'page' : undefined,
      })}
      onClick={onClick}
    >
      <Icon color="currentColor" />
      <Text truncateAfterLines={1} color="currentColor" size="xsmall" weight="semibold">
        {title}
      </Text>
    </StyledBottomNavItem>
  );
};

export { BottomNav, BottomNavItem };
