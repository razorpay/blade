import type { CSSObject } from 'styled-components';

const getStyledLinkStyles = ({ cursor }: { cursor?: CSSObject['cursor'] }): CSSObject => ({
  padding: 0,
  backgroundColor: 'transparent',
  outline: 'none',
  textDecoration: 'none',
  border: 'none',
  cursor,
});

export default getStyledLinkStyles;
