import React from 'react';
import { Pressable, Linking } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import type { BottomNavItemProps, BottomNavProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { logger, throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Text } from '~components/Typography';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { BottomDock } from '~components/BottomDock';

const openURL = async (href: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(href);
    if (canOpen) {
      await Linking.openURL(href);
    }
  } catch {
    if (__DEV__) {
      logger({
        message: `Could not open the link "href=${href}"`,
        moduleName: 'BottomNavItem',
        type: 'warn',
      });
    }
  }
};

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
 * <BottomNav>
 *   <BottomNavItem
 *     isActive={true}
 *     title="Payments"
 *     icon={WalletIcon}
 *   />
 *   <BottomNavItem
 *     title="Transactions"
 *     icon={TransactionsIcon}
 *     onClick={() => navigation.navigate('Transactions')}
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
  const { theme } = useTheme();

  if (__DEV__) {
    const childrenCount = React.Children.count(children);
    if (childrenCount > 5 || childrenCount < 2) {
      throwBladeError({
        moduleName: 'BottomNav',
        message: 'children cannot be less than 2 and more than 5',
      });
    }
  }

  return (
    <BottomDock
      ref={ref as never}
      role="navigation"
      safeAreaBottom
      zIndex={zIndex}
      testID={testID}
      metaName={MetaConstants.BottomNav}
      nativeStyle={{ paddingHorizontal: theme.spacing[2], flexDirection: 'row' }}
      {...rest}
    >
      {children}
    </BottomDock>
  );
};

const BottomNav = assignWithoutSideEffects(React.forwardRef(_BottomNav), {
  displayName: 'BottomNav',
});

const BottomNavItem = ({
  title,
  href,
  rel: _rel,
  target: _target,
  as: _as,
  isActive,
  onClick,
  icon: Icon,
  testID,
  ...rest
}: BottomNavItemProps): React.ReactElement => {
  const { theme } = useTheme();

  if (__DEV__) {
    if (_as) {
      logger({
        moduleName: 'BottomNavItem',
        type: 'warn',
        message:
          'The `as` prop is not supported on React Native. Use the `onClick` prop with your navigation library instead (e.g. `onClick={() => navigation.navigate(route)}`).',
      });
    }
  }

  const iconColor = isActive
    ? ('interactive.icon.primary.subtle' as const)
    : ('interactive.icon.gray.subtle' as const);
  const textColor = isActive
    ? ('interactive.text.primary.subtle' as const)
    : ('interactive.text.gray.subtle' as const);

  const handleOnPress = (event: GestureResponderEvent): void => {
    if (href) {
      void openURL(href as string);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Pressable
      onPress={handleOnPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: theme.spacing[5],
        paddingBottom: theme.spacing[4],
        gap: theme.spacing[1],
      }}
      {...makeAccessible({
        role: 'tab',
        current: isActive ? 'page' : undefined,
      })}
      {...metaAttribute({
        name: MetaConstants.BottomNavItem,
        testID,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      <Icon color={iconColor} size="large" />
      <Text truncateAfterLines={1} color={textColor} size="xsmall" weight="semibold">
        {title}
      </Text>
    </Pressable>
  );
};

export { BottomNav, BottomNavItem };
