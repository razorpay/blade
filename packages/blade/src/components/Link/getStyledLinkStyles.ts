import type { CSSObject } from 'styled-components';

const getStyledLinkStyles = ({ cursor }: { cursor?: CSSObject['cursor'] }): CSSObject => ({
  padding: 0,
  backgroundColor: 'rgba(0,0,0,0)',
  outline: 'none',
  textDecoration: 'none',
  cursor,
  borderColor: 'rgba(0,0,0,0)',
});

export default getStyledLinkStyles;
