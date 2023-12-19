/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CSSObject } from 'styled-components';
import type { HoverlayProps } from './types';
import type { Theme } from '~components/BladeProvider';

const getHoverlayStyles = (
  props: HoverlayProps & {
    theme: Theme;
  },
): CSSObject => {
  return {
    position: 'absolute',
    top: '0px',
    left: '0px',
    bottom: '0px',
    right: '0px',
    opacity: 0,
    zIndex: 0,
    backgroundColor:
      props.variant === 'subtle'
        ? props.theme.colors.interactive.hover.subtle
        : props.theme.colors.interactive.hover.intense,
  };
};

export { getHoverlayStyles };
