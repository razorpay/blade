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
}: StyledLinkProps & { children: React.ReactNode }): ReactElement => {
  console.log('unused props', href, target);
  return <StyledNativeLink disabled={disabled} onPress={onClick} children={children} />;
};

export default StyledLink;
