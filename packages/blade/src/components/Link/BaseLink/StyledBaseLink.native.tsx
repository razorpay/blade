import type { ReactElement } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Linking } from 'react-native';
import styled from 'styled-components/native';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './types';

const StyledNativeLink = styled.Pressable({
  ...getStyledLinkStyles({}),
  alignSelf: 'flex-start',
});

const openURL = async (href: string): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(href);
    if (canOpen) {
      await Linking.openURL(href);
    }
  } catch {
    console.warn(`[Blade: BaseLink]: Could not open the link "href=${href}"`);
  }
};

const StyledLink = ({
  variant,
  disabled,
  href,
  onClick,
  children,
  setCurrentInteraction,
  accessibilityProps,
  // @ts-expect-error avoid exposing to public
  style,
  testID,
}: StyledBaseLinkProps & { children: React.ReactNode }): ReactElement => {
  const handleOnPress = (event: GestureResponderEvent): void => {
    if (href && variant === 'anchor') {
      void openURL(href);
    }

    if (onClick) {
      /*
      React Native's Pressable's onClick returns a GestureResponderEvent but our types expect a SyntheticEvent.
      Until we have a way to handle platform specific types, we will have to ignore this TS error.
      */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      onClick(event);
    }
  };

  return (
    <StyledNativeLink
      {...accessibilityProps}
      disabled={disabled}
      onPress={handleOnPress}
      onPressIn={(): void => setCurrentInteraction('active')}
      onPressOut={(): void => setCurrentInteraction('default')}
      style={style}
      testID={testID}
    >
      {children}
    </StyledNativeLink>
  );
};

export default StyledLink;
