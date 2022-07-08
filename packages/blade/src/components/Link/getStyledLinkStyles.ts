import type { CSSObject } from 'styled-components';

const getStyledLinkStyles = (): CSSObject => ({
  padding: 0,
  cursor: 'pointer',
  backgroundColor: 'rgba(0,0,0,0)',
  outline: 'none',
  textDecoration: 'none',
  borderColor: 'rgba(0,0,0,0)',
});

export default getStyledLinkStyles;
