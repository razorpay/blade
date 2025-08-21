import type { CSSObject } from 'styled-components';

/**
 * Screen reader class adapted from webaim
 * https://webaim.org/techniques/css/invisiblecontent/#techniques
 */
const screenReaderStyles: CSSObject = {
  border: '0',
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  width: '1px',
  margin: '-1px',
  padding: '0',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  position: 'absolute',
  wordWrap: 'normal',
};

export { screenReaderStyles };
