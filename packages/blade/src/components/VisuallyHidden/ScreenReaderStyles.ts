import type { CSSObject } from 'styled-components';

/**
 * Screen reader class adapted from webaim
 * https://webaim.org/techniques/css/invisiblecontent/#techniques
 */
const screenReaderStyles: CSSObject = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: `1px`,
  margin: '0 -1px -1px 0',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: `1px`,
  left: '-10000px',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
};

export { screenReaderStyles };
