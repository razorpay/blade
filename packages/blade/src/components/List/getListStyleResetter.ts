import type { CSSObject } from 'styled-components';

const getListStyleResetter = (): CSSObject => {
  return {
    listStyleType: 'none',
    padding: '0px',
    margin: '0px',
  };
};

export { getListStyleResetter };
