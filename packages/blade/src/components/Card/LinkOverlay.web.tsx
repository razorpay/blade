import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import type { LinkOverlayProps } from './types';

const LinkOverlay = styled.a<LinkOverlayProps>(
  (): CSSObject => {
    return {
      position: 'static',
      '&:before': {
        content: "''",
        cursor: 'inherit',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      },
    };
  },
);

export { LinkOverlay };
