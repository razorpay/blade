import type { ReactElement } from 'react';
import { Linking } from 'react-native';
import styled from 'styled-components/native';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './StyledBaseLink.d';

const StyledNativeLink = styled.Pressable({
  ...getStyledLinkStyles({}),
  alignSelf: 'flex-start',
});

const openURL = (href: string): void => {
  Linking.canOpenURL(href)
    .then((canOpen) => {
      if (canOpen) {
        Linking.openURL(href).catch(() => {
          console.warn(`[Blade: BaseLink]: Could not open the link "href=${href}"`);
        });
      }
    })
    .catch(() => {
      console.warn(`[Blade: BaseLink]: Invalid link passed to "href=${href}"`);
    });
};

const StyledLink = ({
  variant,
  disabled,
  href,
  onClick,
  children,
  setCurrentInteraction,
}: StyledBaseLinkProps & { children: React.ReactNode }): ReactElement => {
  const handleOnPress = (): void => {
    if (href && variant === 'anchor') {
      openURL(href);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <StyledNativeLink
      disabled={disabled}
      onPress={handleOnPress}
      onPressIn={(): void => setCurrentInteraction('active')}
      onPressOut={(): void => setCurrentInteraction('default')}
    >
      {children}
    </StyledNativeLink>
  );
};

export default StyledLink;
