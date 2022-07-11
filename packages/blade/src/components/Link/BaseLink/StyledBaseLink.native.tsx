import type { ReactElement } from 'react';
import styled from 'styled-components/native';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledBaseLinkProps } from './StyledBaseLink.d';

const StyledNativeLink = styled.Pressable({
  ...getStyledLinkStyles({}),
  alignSelf: 'flex-start',
});

const StyledLink = ({
  disabled,
  href,
  onClick,
  target,
  children,
  setCurrentInteraction,
}: StyledBaseLinkProps & { children: React.ReactNode }): ReactElement => {
  console.log('unused props', href, target);

  return (
    <StyledNativeLink
      disabled={disabled}
      onPress={onClick}
      onPressIn={(): void => setCurrentInteraction('active')}
      onPressOut={(): void => setCurrentInteraction('default')}
    >
      {children}
    </StyledNativeLink>
  );
};

export default StyledLink;
