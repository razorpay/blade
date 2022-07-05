import type { CSSObject } from 'styled-components';

const getStyledLinkStyles = (): CSSObject => ({
  padding: 0,
  cursor: 'pointer',
  backgroundColor: 'rgba(0,0,0,0)',
  borderColor: 'rgba(0,0,0,0)',
  borderRadius: '2px',
});

export default getStyledLinkStyles;
