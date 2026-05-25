import React from 'react';
import { View, Pressable, Linking, Platform } from 'react-native';
import type { GestureResponderEvent, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import type { BottomNavItemProps, BottomNavProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { logger, throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { Text } from '~components/Typography';
import { colors as globalColors } from '~tokens/global';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

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

const StyledBottomNav = styled(View)<{
  backgroundColor: string;
  borderTopWidth: number;
  borderTopColor: string;
  paddingHorizontal: number;
}>((props) => ({
  position: 'absolute' as const,
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: props.backgroundColor,
  borderTopWidth: props.borderTopWidth,
  borderTopColor: props.borderTopColor,
  paddingHorizontal: props.paddingHorizontal,
  flexDirection: 'row' as const,
}));

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
  const { theme, colorScheme } = useTheme();
  const insets = useSafeAreaInsets();

  if (__DEV__) {
    const childrenCount = React.Children.count(children);
    if (childrenCount > 5 || childrenCount < 2) {
      throwBladeError({
        moduleName: 'BottomNav',
        message: 'children cannot be less than 2 and more than 5',
      });
    }
  }

  const shadowStyle = React.useMemo<ViewStyle>(() => {
    if (Platform.OS === 'ios') {
      return {
        shadowColor:
          colorScheme === 'light'
            ? globalColors.neutral.blueGrayLight.a912
            : globalColors.neutral.black[100],
        shadowOffset: { width: 0, height: -8 },
        shadowRadius: 24,
        shadowOpacity: 1,
      };
    }
    return { elevation: 8 };
  }, [colorScheme]);

  return (
    <StyledBottomNav
      ref={ref as never}
      backgroundColor={theme.colors.surface.background.gray.intense}
      borderTopWidth={theme.border.width.thin}
      borderTopColor={theme.colors.surface.border.gray.muted}
      paddingHorizontal={theme.spacing[2]}
      style={[shadowStyle, { zIndex, paddingBottom: insets.bottom }]}
      {...makeAccessible({ role: 'navigation' })}
      {...metaAttribute({
        testID,
        name: MetaConstants.BottomNav,
      })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledBottomNav>
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error RN Pressable onPress returns GestureResponderEvent but our types expect MouseEvent
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
