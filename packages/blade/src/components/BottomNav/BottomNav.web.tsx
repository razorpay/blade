import React from 'react';
import styled from 'styled-components';
import type { BottomNavItemProps, BottomNavProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import { makeMotionTime, makeSpace } from '~utils';
import { componentZIndices } from '~utils/componentZIndices';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { throwBladeError } from '~utils/logger';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
const _BottomNav = (
  { children, zIndex = componentZIndices.bottomNav, testID, ...rest }: BottomNavProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
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
      ref={ref as never}
      role="navigation"
      position="fixed"
      bottom="spacing.0"
      left="spacing.0"
      elevation="midRaised"
      width="100%"
      backgroundColor="surface.background.gray.intense"
      borderTopWidth="thin"
      borderTopColor="surface.border.gray.muted"
      paddingX="spacing.2"
      display="flex"
      flexDirection="row"
      {...getStyledProps(rest)}
      zIndex={zIndex}
      {...metaAttribute({
        testID,
        name: MetaConstants.BottomNav,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

const StyledBottomNavItem = styled(BaseBox)<{ to?: string }>((props) => {
  return {
    textDecoration: 'none',
    color: props.theme.colors.interactive.text.gray.subtle,
    backgroundColor: 'transparent',
    border: 'none',
    paddingLeft: makeSpace(props.theme.spacing[0]),
    paddingRight: makeSpace(props.theme.spacing[0]),
    transition: `color ${makeMotionTime(props.theme.motion.duration['2xquick'])} ${
      props.theme.motion.easing.standard
    }`,
    '&[aria-current="page"]': {
      color: props.theme.colors.interactive.text.primary.subtle,
    },
    '&:focus-visible': {
      ...getFocusRingStyles({ theme: props.theme }),
    },
  };
});

const BottomNavItem = ({
  title,
  href,
  rel,
  target,
  as,
  isActive,
  onClick,
  icon: Icon,
  testID,
  ...rest
}: BottomNavItemProps): React.ReactElement => {
  const isRouterLink = as && href;
  const defaultRenderElement = href ? 'a' : 'button';
  const defaultRel = target === '_blank' ? 'noreferrer noopener' : undefined;

  return (
    <StyledBottomNavItem
      as={isRouterLink ? as : defaultRenderElement}
      href={as ? undefined : href}
      to={href} // for react router
      rel={rel ?? defaultRel}
      target={target}
      paddingTop="spacing.5"
      paddingBottom="spacing.4"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flex="1"
      cursor="pointer"
      onClick={onClick}
      gap="spacing.1"
      {...makeAccessible({
        current: isActive ? 'page' : undefined,
      })}
      {...metaAttribute({
        name: MetaConstants.BottomNavItem,
        testID,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      <Icon color="currentColor" size="large" />
      <Text truncateAfterLines={1} color="currentColor" size="xsmall" weight="semibold">
        {title}
      </Text>
    </StyledBottomNavItem>
  );
};

const BottomNav = React.forwardRef(_BottomNav);

export { BottomNav, BottomNavItem };
