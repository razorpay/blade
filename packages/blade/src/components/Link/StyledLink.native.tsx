import type { ReactElement } from 'react';
import styled from 'styled-components/native';
import getStyledLinkStyles from './getStyledLinkStyles';
import type { StyledLinkProps } from './StyledLink';

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
}: StyledLinkProps & { children: React.ReactNode }): ReactElement => {
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
