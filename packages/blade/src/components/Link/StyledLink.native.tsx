import styled from 'styled-components/native';
import getStyledLinkStyles from './getStyledLinkStyles';

const StyledLink = styled.Pressable<{ as: unknown }>(({ as }) => {
  if (as) {
    throw Error('');
  }
  return { ...getStyledLinkStyles() };
});

export default StyledLink;
