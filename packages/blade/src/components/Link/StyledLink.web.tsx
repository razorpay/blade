import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import getStyledLinkStyles from './getStyledLinkStyles';

const StyledLink = styled.button<{ cursor: CSSObject['cursor'] }>(getStyledLinkStyles);

export default StyledLink;
