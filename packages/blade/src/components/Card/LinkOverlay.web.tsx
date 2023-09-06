import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { LinkOverlayProps } from './types';

// https://www.sarasoueidan.com/blog/nested-links/
const LinkOverlay = styled.a<LinkOverlayProps>(
  (): CSSObject => {
    return {
      // Need this to reset the button styles
      all: 'unset',
      cursor: 'pointer',
      appearance: 'none',
      border: 0,
      padding: 0,
      position: 'static',
      '&:before': {
        content: "''",
        cursor: 'inherit',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
        height: '100%',
      },
    };
  },
);

export { LinkOverlay };
