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

// So when we are using screenReaderStyles inside SelectorInput , it is causing wrong layout positioning in bottomSheet. that's why we are using legacyScreenReaderStyles only in SelectorInput. 
//TODO: figure out and remove `legacyScreenReaderStyles` in future.

const legacyScreenReaderStyles: CSSObject = {
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

export { screenReaderStyles, legacyScreenReaderStyles };
