import React from 'react';
import type { ReactElement } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Linking } from 'react-native';
import styled from 'styled-components/native';
import type { StyledBaseLinkProps } from './types';
import getStyledLinkStyles from './getStyledLinkStyles';
import { useStyledProps } from '~components/Box/styledProps';
import { castNativeType } from '~utils';
import type { BladeElementRef } from '~src/hooks/types';

const StyledNativeLink = styled.Pressable((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return {
    ...getStyledLinkStyles({}),
    alignSelf: 'flex-start',
    ...styledPropsCSSObject,
  };
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

const _StyledLink: React.ForwardRefRenderFunction<
  BladeElementRef,
  StyledBaseLinkProps & { children: React.ReactNode }
> = (
  {
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
    hitSlop,
    onTouchStart,
    onTouchEnd,
  },
  ref,
): ReactElement => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...accessibilityProps}
      disabled={disabled}
      onPress={handleOnPress}
      onPressIn={(): void => setCurrentInteraction('active')}
      onPressOut={(): void => setCurrentInteraction('default')}
      onTouchStart={castNativeType(onTouchStart)}
      onTouchEnd={castNativeType(onTouchEnd)}
      style={style}
      testID={testID}
      hitSlop={hitSlop}
    >
      {children}
    </StyledNativeLink>
  );
};

const StyledLink = React.forwardRef(_StyledLink);

export default StyledLink;
